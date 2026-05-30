import { BadRequestException, NotFoundException } from '@nestjs/common';
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
      'deleteByClerkId' | 'findProfileByClerkId' | 'updateProfileByClerkId'
    >
  >;
  let service: UsersService;

  beforeEach(() => {
    usersRepository = {
      deleteByClerkId: jest.fn().mockResolvedValue(undefined),
      findProfileByClerkId: jest.fn().mockResolvedValue(profile),
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

  it('rejects invalid travelStyle values', async () => {
    await expect(
      service.updateCurrentUser('user_123', {
        travelStyle: 'FAST' as never,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects invalid onboarding completion values', async () => {
    await expect(
      service.updateCurrentUser('user_123', {
        hasCompletedOnboarding: 'yes' as never,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('deletes the current user by Clerk id', async () => {
    await service.deleteCurrentUser('user_123');

    expect(usersRepository.deleteByClerkId).toHaveBeenCalledWith('user_123');
  });
});
