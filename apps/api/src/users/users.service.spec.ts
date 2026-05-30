import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import type { UsersRepository } from './users.repository';

describe('UsersService profile endpoints', () => {
  const profile = {
    id: 'db_user_1',
    clerkId: 'user_123',
    email: 'pat@example.com',
    name: 'Patrick',
    photoUrl: null,
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
      | 'getAllUsers'
      | 'updateProfileByClerkId'
    >
  >;
  let service: UsersService;

  beforeEach(() => {
    usersRepository = {
      deleteByClerkId: jest.fn().mockResolvedValue(undefined),
      findProfileByClerkId: jest.fn().mockResolvedValue(profile),
      getAllUsers: jest.fn().mockResolvedValue({ users: [profile] }),
      updateProfileByClerkId: jest.fn().mockResolvedValue(profile),
    };
    service = new UsersService(usersRepository as unknown as UsersRepository);
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

  it('returns all users for admin users', async () => {
    await expect(
      service.getAllUsers({ clerkId: 'admin_123', isAdmin: true }),
    ).resolves.toEqual({ users: [profile] });

    expect(usersRepository.getAllUsers).toHaveBeenCalledTimes(1);
  });

  it('rejects all-user access for non-admin users', async () => {
    await expect(
      service.getAllUsers({ clerkId: 'user_123', isAdmin: false }),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(usersRepository.getAllUsers).not.toHaveBeenCalled();
  });
});
