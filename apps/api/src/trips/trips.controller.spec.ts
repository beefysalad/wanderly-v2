import { HttpStatus } from '@nestjs/common';
import type { CreateTripRequest, Trip } from '@workspace/shared';
import { TripsController } from './trips.controller';
import type { TripsService } from './trips.service';

describe('TripsController', () => {
  const currentUser = {
    clerkId: 'clerk_user_1',
    isAdmin: false,
  };

  const trip: Trip = {
    id: 'trip_1',
    groupId: null,
    createdById: 'db_user_1',
    name: 'Surf & Slow Mornings',
    destination: 'Siargao',
    startDate: '2026-06-12T00:00:00.000Z',
    endDate: '2026-06-16T00:00:00.000Z',
    status: 'PLANNING',
    currency: 'PHP',
    budget: '30000',
    aiGenerated: false,
    createdAt: '2026-05-31T00:00:00.000Z',
    updatedAt: '2026-05-31T00:00:00.000Z',
  };

  let tripsService: jest.Mocked<
    Pick<
      TripsService,
      | 'attachTripToGroup'
      | 'createTrip'
      | 'deleteTrip'
      | 'getRsvps'
      | 'getTrip'
      | 'getTrips'
      | 'getTripsByGroup'
      | 'updateRsvp'
      | 'updateTrip'
    >
  >;
  let controller: TripsController;

  beforeEach(() => {
    tripsService = {
      attachTripToGroup: jest.fn().mockResolvedValue({
        ...trip,
        groupId: 'group_1',
      }),
      createTrip: jest.fn().mockResolvedValue(trip),
      deleteTrip: jest.fn().mockResolvedValue(undefined),
      getRsvps: jest.fn().mockResolvedValue([]),
      getTrip: jest.fn().mockResolvedValue(trip),
      getTrips: jest.fn().mockResolvedValue([trip]),
      getTripsByGroup: jest.fn().mockResolvedValue([trip]),
      updateRsvp: jest.fn().mockResolvedValue({
        id: 'rsvp_1',
        tripId: 'trip_1',
        userId: 'db_user_1',
        status: 'GOING',
        updatedAt: '2026-05-31T01:00:00.000Z',
      }),
      updateTrip: jest.fn().mockResolvedValue(trip),
    };

    controller = new TripsController(
      tripsService as unknown as TripsService,
    );
  });

  it('delegates list reads with the current Clerk subject', async () => {
    await expect(controller.getTrips(currentUser)).resolves.toEqual([trip]);

    expect(tripsService.getTrips).toHaveBeenCalledWith('clerk_user_1');
  });

  it('delegates solo trip creation with the current Clerk subject', async () => {
    const input: CreateTripRequest = {
      name: 'Surf & Slow Mornings',
    };

    await expect(controller.createTrip(currentUser, input)).resolves.toBe(trip);

    expect(tripsService.createTrip).toHaveBeenCalledWith(
      'clerk_user_1',
      input,
    );
  });

  it('delegates group trip listing with current user authorization context', async () => {
    await expect(
      controller.getTripsByGroup(currentUser, 'group_1'),
    ).resolves.toEqual([trip]);

    expect(tripsService.getTripsByGroup).toHaveBeenCalledWith(
      'clerk_user_1',
      'group_1',
    );
  });

  it('delegates attaching a solo trip to a group', async () => {
    await expect(
      controller.attachTripToGroup(currentUser, 'trip_1', {
        groupId: 'group_1',
      }),
    ).resolves.toMatchObject({
      groupId: 'group_1',
    });

    expect(tripsService.attachTripToGroup).toHaveBeenCalledWith(
      'clerk_user_1',
      'trip_1',
      { groupId: 'group_1' },
    );
  });

  it('delegates RSVP updates', async () => {
    await expect(
      controller.updateRsvp(currentUser, 'trip_1', {
        status: 'going',
      }),
    ).resolves.toMatchObject({
      status: 'GOING',
    });

    expect(tripsService.updateRsvp).toHaveBeenCalledWith(
      'clerk_user_1',
      'trip_1',
      { status: 'going' },
    );
  });

  it('deletes a trip with 204 metadata', async () => {
    const deleteTripHandler = Object.getOwnPropertyDescriptor(
      TripsController.prototype,
      'deleteTrip',
    )?.value as () => Promise<void>;

    expect(Reflect.getMetadata('__httpCode__', deleteTripHandler)).toBe(
      HttpStatus.NO_CONTENT,
    );

    await expect(
      controller.deleteTrip(currentUser, 'trip_1'),
    ).resolves.toBeUndefined();
    expect(tripsService.deleteTrip).toHaveBeenCalledWith(
      'clerk_user_1',
      'trip_1',
    );
  });
});
