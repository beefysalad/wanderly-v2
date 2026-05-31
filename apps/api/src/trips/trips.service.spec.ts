import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import type {
  AttachTripToGroupRequest,
  CreateTripRequest,
  Trip,
  TripRsvp,
} from '@workspace/shared';
import { TripsRepository, type TripRecord } from './trips.repository';
import { TripsService } from './trips.service';

const dbUser = {
  id: 'db_user_1',
  clerkId: 'clerk_user_1',
};

const soloTripRecord: TripRecord = {
  id: 'trip_solo_1',
  groupId: null,
  createdById: dbUser.id,
  name: 'Surf & Slow Mornings',
  destination: 'Siargao',
  startDate: new Date('2026-06-12T00:00:00.000Z'),
  endDate: new Date('2026-06-16T00:00:00.000Z'),
  status: 'PLANNING',
  currency: 'PHP',
  budget: '30000',
  aiGenerated: false,
  createdAt: new Date('2026-05-31T00:00:00.000Z'),
  updatedAt: new Date('2026-05-31T00:00:00.000Z'),
};

const groupTripRecord: TripRecord = {
  ...soloTripRecord,
  id: 'trip_group_1',
  groupId: 'group_1',
  name: 'Palawan Barkada',
};

function tripResponse(record: TripRecord): Trip {
  return {
    id: record.id,
    groupId: record.groupId,
    createdById: record.createdById,
    name: record.name,
    destination: record.destination,
    startDate: record.startDate?.toISOString() ?? null,
    endDate: record.endDate?.toISOString() ?? null,
    status: record.status,
    currency: record.currency,
    budget: record.budget,
    aiGenerated: record.aiGenerated,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

describe('TripsService', () => {
  let tripsRepository: jest.Mocked<
    Pick<
      TripsRepository,
      | 'attachTripToGroup'
      | 'createTrip'
      | 'deleteTrip'
      | 'findGroupMembership'
      | 'findTripById'
      | 'findTripRsvps'
      | 'findTripsByGroupId'
      | 'findTripsForUser'
      | 'findUserByClerkId'
      | 'updateTrip'
      | 'upsertTripRsvp'
    >
  >;
  let service: TripsService;

  beforeEach(() => {
    tripsRepository = {
      attachTripToGroup: jest.fn().mockResolvedValue(groupTripRecord),
      createTrip: jest.fn().mockResolvedValue(soloTripRecord),
      deleteTrip: jest.fn().mockResolvedValue(undefined),
      findGroupMembership: jest.fn().mockResolvedValue(null),
      findTripById: jest.fn().mockResolvedValue(soloTripRecord),
      findTripRsvps: jest.fn().mockResolvedValue([]),
      findTripsByGroupId: jest.fn().mockResolvedValue([groupTripRecord]),
      findTripsForUser: jest
        .fn()
        .mockResolvedValue([soloTripRecord, groupTripRecord]),
      findUserByClerkId: jest.fn().mockResolvedValue(dbUser),
      updateTrip: jest.fn().mockResolvedValue(soloTripRecord),
      upsertTripRsvp: jest.fn().mockResolvedValue({
        id: 'rsvp_1',
        tripId: 'trip_group_1',
        userId: dbUser.id,
        status: 'GOING',
        updatedAt: new Date('2026-05-31T01:00:00.000Z'),
      }),
    };

    service = new TripsService(
      tripsRepository as unknown as TripsRepository,
    );
  });

  it('creates a solo trip owned by the authenticated user when groupId is omitted', async () => {
    const input: CreateTripRequest = {
      name: 'Surf & Slow Mornings',
      destination: 'Siargao',
      startDate: '2026-06-12',
      endDate: '2026-06-16',
      budget: '30000',
      currency: 'PHP',
    };

    await expect(service.createTrip('clerk_user_1', input)).resolves.toEqual(
      tripResponse(soloTripRecord),
    );

    expect(tripsRepository.createTrip).toHaveBeenCalledWith({
      createdById: dbUser.id,
      groupId: null,
      name: 'Surf & Slow Mornings',
      destination: 'Siargao',
      startDate: new Date('2026-06-12T00:00:00.000Z'),
      endDate: new Date('2026-06-16T00:00:00.000Z'),
      budget: '30000',
      currency: 'PHP',
    });
    expect(tripsRepository.findGroupMembership).not.toHaveBeenCalled();
  });

  it('requires group membership before creating a group trip', async () => {
    const input: CreateTripRequest = {
      name: 'Palawan Barkada',
      groupId: 'group_1',
    };

    await expect(service.createTrip('clerk_user_1', input)).rejects.toBeInstanceOf(
      ForbiddenException,
    );

    expect(tripsRepository.createTrip).not.toHaveBeenCalled();
  });

  it('returns solo and group trips visible to the authenticated user', async () => {
    await expect(service.getTrips('clerk_user_1')).resolves.toEqual([
      tripResponse(soloTripRecord),
      tripResponse(groupTripRecord),
    ]);

    expect(tripsRepository.findTripsForUser).toHaveBeenCalledWith(dbUser.id);
  });

  it('denies a non-member from reading trips for a group', async () => {
    await expect(
      service.getTripsByGroup('clerk_user_1', 'group_1'),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(tripsRepository.findTripsByGroupId).not.toHaveBeenCalled();
  });

  it('denies a non-member from modifying a group trip', async () => {
    tripsRepository.findTripById.mockResolvedValueOnce(groupTripRecord);

    await expect(
      service.updateTrip('clerk_user_1', 'trip_group_1', {
        name: 'Updated Palawan',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(tripsRepository.updateTrip).not.toHaveBeenCalled();
  });

  it('upserts the authenticated user RSVP for a group trip', async () => {
    tripsRepository.findTripById.mockResolvedValueOnce(groupTripRecord);
    tripsRepository.findGroupMembership.mockResolvedValueOnce({
      id: 'membership_1',
      role: 'MEMBER',
    });

    const expected: TripRsvp = {
      id: 'rsvp_1',
      tripId: 'trip_group_1',
      userId: dbUser.id,
      status: 'GOING',
      updatedAt: '2026-05-31T01:00:00.000Z',
    };

    await expect(
      service.updateRsvp('clerk_user_1', 'trip_group_1', { status: 'going' }),
    ).resolves.toEqual(expected);

    expect(tripsRepository.upsertTripRsvp).toHaveBeenCalledWith({
      tripId: 'trip_group_1',
      userId: dbUser.id,
      status: 'GOING',
    });
  });

  it('rejects RSVP updates for solo trips', async () => {
    await expect(
      service.updateRsvp('clerk_user_1', 'trip_solo_1', { status: 'going' }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(tripsRepository.upsertTripRsvp).not.toHaveBeenCalled();
  });

  it('attaches an owned solo trip to a group the user belongs to', async () => {
    tripsRepository.findGroupMembership.mockResolvedValueOnce({
      id: 'membership_1',
      role: 'MEMBER',
    });

    const input: AttachTripToGroupRequest = {
      groupId: 'group_1',
    };

    await expect(
      service.attachTripToGroup('clerk_user_1', 'trip_solo_1', input),
    ).resolves.toEqual(tripResponse(groupTripRecord));

    expect(tripsRepository.attachTripToGroup).toHaveBeenCalledWith(
      'trip_solo_1',
      'group_1',
    );
  });

  it('does not attach another user owned solo trip to a group', async () => {
    tripsRepository.findTripById.mockResolvedValueOnce({
      ...soloTripRecord,
      createdById: 'db_user_2',
    });

    await expect(
      service.attachTripToGroup('clerk_user_1', 'trip_solo_1', {
        groupId: 'group_1',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(tripsRepository.attachTripToGroup).not.toHaveBeenCalled();
  });

  it('allows only the creator to delete a trip', async () => {
    tripsRepository.findTripById.mockResolvedValueOnce({
      ...soloTripRecord,
      createdById: 'db_user_2',
    });

    await expect(
      service.deleteTrip('clerk_user_1', 'trip_solo_1'),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(tripsRepository.deleteTrip).not.toHaveBeenCalled();
  });

  it('returns 404 when the authenticated user row does not exist', async () => {
    tripsRepository.findUserByClerkId.mockResolvedValueOnce(null);

    await expect(service.getTrips('missing_clerk')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
