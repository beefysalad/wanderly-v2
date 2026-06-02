import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import type { UsersRepository } from '../../users/users.repository';

describe('AdminUsersService', () => {
  const adminUser = {
    clerkId: 'admin_123',
    isAdmin: true,
  };

  const regularUser = {
    clerkId: 'user_123',
    isAdmin: false,
  };

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
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  };

  let usersRepository: jest.Mocked<
    Pick<
      UsersRepository,
      'findAdminUserById' | 'getAdminUsers' | 'updateAdminUserById'
    >
  >;
  let service: AdminUsersService;

  beforeEach(() => {
    usersRepository = {
      findAdminUserById: jest.fn().mockResolvedValue(profile),
      getAdminUsers: jest.fn().mockResolvedValue([
        {
          id: profile.id,
          clerkId: profile.clerkId,
          email: profile.email,
          name: profile.name,
          imageUrl: profile.photoUrl,
          authProviders: profile.authProviders,
          travelStyle: profile.travelStyle,
          hasCompletedOnboarding: profile.hasCompletedOnboarding,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
        },
      ]),
      updateAdminUserById: jest.fn().mockResolvedValue(profile),
    };
    service = new AdminUsersService(
      usersRepository as unknown as UsersRepository,
    );
  });

  it('returns users for admins', async () => {
    await expect(service.getUsers(adminUser)).resolves.toEqual({
      users: [
        {
          id: profile.id,
          clerkId: profile.clerkId,
          email: profile.email,
          name: profile.name,
          imageUrl: profile.photoUrl,
          authProviders: profile.authProviders,
          travelStyle: profile.travelStyle,
          hasCompletedOnboarding: profile.hasCompletedOnboarding,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
        },
      ],
    });

    expect(usersRepository.getAdminUsers).toHaveBeenCalledTimes(1);
  });

  it('rejects user lists for non-admins', async () => {
    await expect(service.getUsers(regularUser)).rejects.toBeInstanceOf(
      ForbiddenException,
    );

    expect(usersRepository.getAdminUsers).not.toHaveBeenCalled();
  });

  it('returns a detailed user for admins', async () => {
    await expect(service.getUser(adminUser, 'db_user_1')).resolves.toBe(
      profile,
    );
  });

  it('returns 404 when the admin user detail is missing', async () => {
    usersRepository.findAdminUserById.mockResolvedValueOnce(null);

    await expect(service.getUser(adminUser, 'missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates onboarding for admins', async () => {
    await expect(
      service.updateUser(adminUser, 'db_user_1', {
        hasCompletedOnboarding: true,
      }),
    ).resolves.toBe(profile);

    expect(usersRepository.updateAdminUserById).toHaveBeenCalledWith(
      'db_user_1',
      {
        hasCompletedOnboarding: true,
      },
    );
  });
});
