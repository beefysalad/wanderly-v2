import { NotFoundException } from '@nestjs/common';
import { createClerkClient } from '@clerk/backend';
import { UsersService } from './users.service';
import type { UsersRepository } from './users.repository';

jest.mock('@clerk/backend', () => ({
  createClerkClient: jest.fn(),
}));

const mockCreateClerkClient = jest.mocked(createClerkClient);

describe('UsersService profile endpoints', () => {
  const profile = {
    id: 'db_user_1',
    clerkId: 'user_123',
    email: 'pat@example.com',
    name: 'Patrick',
    photoUrl: null,
    authProviders: [],
    bio: null,
    travelStyle: 'BUDGET' as const,
    interests: [],
    hasCompletedOnboarding: false,
  };

  let usersRepository: jest.Mocked<
    Pick<
      UsersRepository,
      | 'deleteByClerkId'
      | 'findProfileByClerkId'
      | 'updateProfileByClerkId'
      | 'upsertClerkUser'
    >
  >;
  let service: UsersService;

  beforeEach(() => {
    usersRepository = {
      deleteByClerkId: jest.fn().mockResolvedValue(undefined),
      findProfileByClerkId: jest.fn().mockResolvedValue(profile),
      updateProfileByClerkId: jest.fn().mockResolvedValue(profile),
      upsertClerkUser: jest.fn().mockResolvedValue({
        id: 'db_user_1',
        clerkId: 'user_123',
        email: 'pat@example.com',
        name: 'Patrick',
        imageUrl: null,
        authProviders: [],
      }),
    };
    mockCreateClerkClient.mockReset();
    service = new UsersService(usersRepository as unknown as UsersRepository);
  });

  it('syncs linked Google and Apple OAuth providers from Clerk', async () => {
    process.env.CLERK_SECRET_KEY = 'sk_test_unit';
    mockCreateClerkClient.mockReturnValueOnce({
      users: {
        getUser: jest.fn().mockResolvedValue({
          id: 'user_123',
          emailAddresses: [
            {
              id: 'email_1',
              emailAddress: 'pat@example.com',
            },
          ],
          externalAccounts: [
            {
              provider: 'google',
            },
            {
              provider: 'oauth_apple',
            },
          ],
          firstName: 'Patrick',
          imageUrl: null,
          lastName: null,
          primaryEmailAddressId: 'email_1',
          username: null,
        }),
      },
    } as never);

    await service.syncCurrentUser('user_123');

    expect(usersRepository.upsertClerkUser).toHaveBeenCalledWith({
      clerkId: 'user_123',
      email: 'pat@example.com',
      authProviders: ['GOOGLE', 'APPLE'],
      imageUrl: null,
      name: 'Patrick',
    });
  });

  it('returns the current user profile', async () => {
    await expect(service.getCurrentUser('user_123')).resolves.toBe(profile);
  });

  it('returns 404 when the current user profile does not exist', async () => {
    usersRepository.findProfileByClerkId.mockResolvedValueOnce(null);

    await expect(service.getCurrentUser('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates only provided profile fields', async () => {
    const patch = {
      bio: 'Updated',
      hasCompletedOnboarding: true,
      interests: ['museums'],
    };

    await expect(service.updateCurrentUser('user_123', patch)).resolves.toBe(
      profile,
    );
    expect(usersRepository.updateProfileByClerkId).toHaveBeenCalledWith(
      'user_123',
      patch,
    );
  });

  it('deletes the current user by Clerk id', async () => {
    await service.deleteCurrentUser('user_123');

    expect(usersRepository.deleteByClerkId).toHaveBeenCalledWith('user_123');
  });
});
