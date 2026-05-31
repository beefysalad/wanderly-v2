import { Injectable } from '@nestjs/common';
import type { RsvpStatus, TripStatus } from '@workspace/shared';
import type { MemberRole, Trip, TripRsvp } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type UserRecord = {
  id: string;
  clerkId: string;
};

export type GroupMembershipRecord = {
  id: string;
  role: MemberRole;
};

export type TripRecord = {
  id: string;
  groupId: string | null;
  createdById: string;
  name: string;
  destination: string | null;
  startDate: Date | null;
  endDate: Date | null;
  status: TripStatus;
  currency: string;
  budget: string | null;
  aiGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type TripRsvpRecord = {
  id: string;
  tripId: string;
  userId: string;
  status: RsvpStatus;
  updatedAt: Date;
};

export type CreateTripData = {
  createdById: string;
  groupId: string | null;
  name: string;
  destination: string | null;
  startDate: Date | null;
  endDate: Date | null;
  budget: string | null;
  currency: string;
};

export type UpdateTripData = Partial<{
  name: string;
  destination: string | null;
  startDate: Date | null;
  endDate: Date | null;
  status: TripStatus;
  budget: string | null;
  currency: string;
}>;

export type UpsertTripRsvpData = {
  tripId: string;
  userId: string;
  status: RsvpStatus;
};

@Injectable()
export class TripsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByClerkId(clerkId: string): Promise<UserRecord | null> {
    return await this.prisma.db.user.findUnique({
      where: {
        clerkId,
      },
      select: {
        id: true,
        clerkId: true,
      },
    });
  }

  async findGroupMembership(
    groupId: string,
    userId: string,
  ): Promise<GroupMembershipRecord | null> {
    return await this.prisma.db.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
      select: {
        id: true,
        role: true,
      },
    });
  }

  async createTrip(data: CreateTripData): Promise<TripRecord> {
    const trip = await this.prisma.db.trip.create({
      data,
    });

    return this.toTripRecord(trip);
  }

  async findTripById(id: string): Promise<TripRecord | null> {
    const trip = await this.prisma.db.trip.findUnique({
      where: {
        id,
      },
    });

    return trip ? this.toTripRecord(trip) : null;
  }

  async findTripsForUser(userId: string): Promise<TripRecord[]> {
    const trips = await this.prisma.db.trip.findMany({
      where: {
        OR: [
          {
            createdById: userId,
            groupId: null,
          },
          {
            group: {
              members: {
                some: {
                  userId,
                },
              },
            },
          },
        ],
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return trips.map((trip) => this.toTripRecord(trip));
  }

  async findTripsByGroupId(groupId: string): Promise<TripRecord[]> {
    const trips = await this.prisma.db.trip.findMany({
      where: {
        groupId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return trips.map((trip) => this.toTripRecord(trip));
  }

  async updateTrip(id: string, data: UpdateTripData): Promise<TripRecord> {
    const trip = await this.prisma.db.trip.update({
      where: {
        id,
      },
      data,
    });

    return this.toTripRecord(trip);
  }

  async deleteTrip(id: string): Promise<void> {
    await this.prisma.db.trip.delete({
      where: {
        id,
      },
    });
  }

  async attachTripToGroup(id: string, groupId: string): Promise<TripRecord> {
    const trip = await this.prisma.db.trip.update({
      where: {
        id,
      },
      data: {
        groupId,
      },
    });

    return this.toTripRecord(trip);
  }

  async findTripRsvps(tripId: string): Promise<TripRsvpRecord[]> {
    const rsvps = await this.prisma.db.tripRsvp.findMany({
      where: {
        tripId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return rsvps.map((rsvp) => this.toTripRsvpRecord(rsvp));
  }

  async upsertTripRsvp(data: UpsertTripRsvpData): Promise<TripRsvpRecord> {
    const rsvp = await this.prisma.db.tripRsvp.upsert({
      where: {
        tripId_userId: {
          tripId: data.tripId,
          userId: data.userId,
        },
      },
      update: {
        status: data.status,
      },
      create: data,
    });

    return this.toTripRsvpRecord(rsvp);
  }

  private toTripRecord(trip: Trip): TripRecord {
    return {
      id: trip.id,
      groupId: trip.groupId,
      createdById: trip.createdById,
      name: trip.name,
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      status: trip.status,
      currency: trip.currency,
      budget: trip.budget?.toString() ?? null,
      aiGenerated: trip.aiGenerated,
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt,
    };
  }

  private toTripRsvpRecord(rsvp: TripRsvp): TripRsvpRecord {
    return {
      id: rsvp.id,
      tripId: rsvp.tripId,
      userId: rsvp.userId,
      status: rsvp.status,
      updatedAt: rsvp.updatedAt,
    };
  }
}
