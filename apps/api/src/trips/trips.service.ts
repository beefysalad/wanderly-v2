import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  AttachTripToGroupRequest,
  CreateTripRequest,
  RsvpStatus,
  RsvpStatusInput,
  Trip,
  TripRsvp,
  TripStatus,
  TripStatusInput,
  UpdateTripRequest,
  UpdateTripRsvpRequest,
} from '@workspace/shared';
import {
  TripsRepository,
  type TripRecord,
  type TripRsvpRecord,
  type UpdateTripData,
  type UserRecord,
} from './trips.repository';

const TRIP_STATUS_BY_INPUT: Record<TripStatusInput, TripStatus> = {
  planning: 'PLANNING',
  completed: 'COMPLETED',
  cancelled: 'CANCELLED',
};

const RSVP_STATUS_BY_INPUT: Record<RsvpStatusInput, RsvpStatus> = {
  going: 'GOING',
  maybe: 'MAYBE',
  not_going: 'NOT_GOING',
};

@Injectable()
export class TripsService {
  constructor(private readonly tripsRepository: TripsRepository) {}

  async createTrip(
    clerkId: string,
    input: CreateTripRequest,
  ): Promise<Trip> {
    const user = await this.getUserOrThrow(clerkId);
    const groupId = input.groupId ?? null;

    if (groupId) {
      await this.assertGroupMember(groupId, user.id);
    }

    const startDate = this.parseDateOrNull(input.startDate, 'startDate');
    const endDate = this.parseDateOrNull(input.endDate, 'endDate');
    this.assertDateRange(startDate, endDate);

    const trip = await this.tripsRepository.createTrip({
      createdById: user.id,
      groupId,
      name: input.name,
      destination: input.destination ?? null,
      startDate,
      endDate,
      budget: input.budget ?? null,
      currency: input.currency ?? 'PHP',
    });

    return this.toTrip(trip);
  }

  async getTrips(clerkId: string): Promise<Trip[]> {
    const user = await this.getUserOrThrow(clerkId);
    const trips = await this.tripsRepository.findTripsForUser(user.id);

    return trips.map((trip) => this.toTrip(trip));
  }

  async getTrip(clerkId: string, tripId: string): Promise<Trip> {
    const user = await this.getUserOrThrow(clerkId);
    const trip = await this.getTripOrThrow(tripId);

    await this.assertTripAccess(trip, user.id);

    return this.toTrip(trip);
  }

  async updateTrip(
    clerkId: string,
    tripId: string,
    input: UpdateTripRequest,
  ): Promise<Trip> {
    const user = await this.getUserOrThrow(clerkId);
    const trip = await this.getTripOrThrow(tripId);

    await this.assertTripAccess(trip, user.id);

    const data = this.toUpdateTripData(input, trip);
    const updatedTrip = await this.tripsRepository.updateTrip(tripId, data);

    return this.toTrip(updatedTrip);
  }

  async deleteTrip(clerkId: string, tripId: string): Promise<void> {
    const user = await this.getUserOrThrow(clerkId);
    const trip = await this.getTripOrThrow(tripId);

    await this.assertTripAccess(trip, user.id);

    if (trip.createdById !== user.id) {
      throw new ForbiddenException('Only the trip creator can delete this trip');
    }

    await this.tripsRepository.deleteTrip(tripId);
  }

  async getTripsByGroup(clerkId: string, groupId: string): Promise<Trip[]> {
    const user = await this.getUserOrThrow(clerkId);

    await this.assertGroupMember(groupId, user.id);

    const trips = await this.tripsRepository.findTripsByGroupId(groupId);

    return trips.map((trip) => this.toTrip(trip));
  }

  async attachTripToGroup(
    clerkId: string,
    tripId: string,
    input: AttachTripToGroupRequest,
  ): Promise<Trip> {
    const user = await this.getUserOrThrow(clerkId);
    const trip = await this.getTripOrThrow(tripId);

    if (trip.groupId) {
      throw new BadRequestException('Trip is already attached to a group');
    }

    if (trip.createdById !== user.id) {
      throw new ForbiddenException('Only the trip creator can attach a group');
    }

    await this.assertGroupMember(input.groupId, user.id);

    const updatedTrip = await this.tripsRepository.attachTripToGroup(
      tripId,
      input.groupId,
    );

    return this.toTrip(updatedTrip);
  }

  async getRsvps(clerkId: string, tripId: string): Promise<TripRsvp[]> {
    const user = await this.getUserOrThrow(clerkId);
    const trip = await this.getTripOrThrow(tripId);

    await this.assertGroupTripAccessForRsvp(trip, user.id);

    const rsvps = await this.tripsRepository.findTripRsvps(tripId);

    return rsvps.map((rsvp) => this.toTripRsvp(rsvp));
  }

  async updateRsvp(
    clerkId: string,
    tripId: string,
    input: UpdateTripRsvpRequest,
  ): Promise<TripRsvp> {
    const user = await this.getUserOrThrow(clerkId);
    const trip = await this.getTripOrThrow(tripId);

    await this.assertGroupTripAccessForRsvp(trip, user.id);

    const rsvp = await this.tripsRepository.upsertTripRsvp({
      tripId,
      userId: user.id,
      status: RSVP_STATUS_BY_INPUT[input.status],
    });

    return this.toTripRsvp(rsvp);
  }

  private async getUserOrThrow(clerkId: string): Promise<UserRecord> {
    const user = await this.tripsRepository.findUserByClerkId(clerkId);

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    return user;
  }

  private async getTripOrThrow(tripId: string): Promise<TripRecord> {
    const trip = await this.tripsRepository.findTripById(tripId);

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    return trip;
  }

  private async assertGroupMember(
    groupId: string,
    userId: string,
  ): Promise<void> {
    const membership = await this.tripsRepository.findGroupMembership(
      groupId,
      userId,
    );

    if (!membership) {
      throw new ForbiddenException('Group access denied');
    }
  }

  private async assertTripAccess(
    trip: TripRecord,
    userId: string,
  ): Promise<void> {
    if (!trip.groupId) {
      if (trip.createdById !== userId) {
        throw new ForbiddenException('Trip access denied');
      }
      return;
    }

    await this.assertGroupMember(trip.groupId, userId);
  }

  private async assertGroupTripAccessForRsvp(
    trip: TripRecord,
    userId: string,
  ): Promise<void> {
    if (!trip.groupId) {
      throw new BadRequestException('RSVP is only available for group trips');
    }

    await this.assertGroupMember(trip.groupId, userId);
  }

  private parseDateOrNull(
    value: string | null | undefined,
    fieldName: string,
  ): Date | null {
    if (value == null) {
      return null;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(`${fieldName} must be a valid date`);
    }

    return date;
  }

  private parseDateOrUndefined(
    value: string | null | undefined,
    fieldName: string,
  ): Date | null | undefined {
    if (value === undefined) {
      return undefined;
    }

    return this.parseDateOrNull(value, fieldName);
  }

  private assertDateRange(
    startDate: Date | null | undefined,
    endDate: Date | null | undefined,
  ): void {
    if (startDate && endDate && startDate > endDate) {
      throw new BadRequestException('startDate must be before endDate');
    }
  }

  private toUpdateTripData(
    input: UpdateTripRequest,
    existingTrip: TripRecord,
  ): UpdateTripData {
    const startDate = this.parseDateOrUndefined(input.startDate, 'startDate');
    const endDate = this.parseDateOrUndefined(input.endDate, 'endDate');
    const resolvedStartDate =
      startDate !== undefined ? startDate : existingTrip.startDate;
    const resolvedEndDate =
      endDate !== undefined ? endDate : existingTrip.endDate;
    this.assertDateRange(resolvedStartDate, resolvedEndDate);

    const data: UpdateTripData = {};

    if (input.name !== undefined) {
      data.name = input.name;
    }

    if (input.destination !== undefined) {
      data.destination = input.destination;
    }

    if (startDate !== undefined) {
      data.startDate = startDate;
    }

    if (endDate !== undefined) {
      data.endDate = endDate;
    }

    if (input.status !== undefined) {
      data.status = TRIP_STATUS_BY_INPUT[input.status];
    }

    if (input.budget !== undefined) {
      data.budget = input.budget;
    }

    if (input.currency !== undefined) {
      data.currency = input.currency;
    }

    return data;
  }

  private toTrip(trip: TripRecord): Trip {
    return {
      id: trip.id,
      groupId: trip.groupId,
      createdById: trip.createdById,
      name: trip.name,
      destination: trip.destination,
      startDate: trip.startDate?.toISOString() ?? null,
      endDate: trip.endDate?.toISOString() ?? null,
      status: trip.status,
      currency: trip.currency,
      budget: trip.budget,
      aiGenerated: trip.aiGenerated,
      createdAt: trip.createdAt.toISOString(),
      updatedAt: trip.updatedAt.toISOString(),
    };
  }

  private toTripRsvp(rsvp: TripRsvpRecord): TripRsvp {
    return {
      id: rsvp.id,
      tripId: rsvp.tripId,
      userId: rsvp.userId,
      status: rsvp.status,
      updatedAt: rsvp.updatedAt.toISOString(),
    };
  }
}
