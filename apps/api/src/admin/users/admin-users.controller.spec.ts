import { AdminUsersController } from './admin-users.controller';
import type { AdminUsersService } from './admin-users.service';

describe('AdminUsersController', () => {
  const adminUser = {
    clerkId: 'admin_123',
    isAdmin: true,
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

  let adminUsersService: jest.Mocked<
    Pick<AdminUsersService, 'getUser' | 'getUsers' | 'updateUser'>
  >;
  let controller: AdminUsersController;

  beforeEach(() => {
    adminUsersService = {
      getUser: jest.fn().mockResolvedValue(profile),
      getUsers: jest.fn().mockResolvedValue({ users: [] }),
      updateUser: jest.fn().mockResolvedValue(profile),
    };
    controller = new AdminUsersController(
      adminUsersService as unknown as AdminUsersService,
    );
  });

  it('delegates admin user list reads', async () => {
    await expect(controller.getUsers(adminUser)).resolves.toEqual({
      users: [],
    });

    expect(adminUsersService.getUsers).toHaveBeenCalledWith(adminUser);
  });

  it('delegates admin user detail reads', async () => {
    await expect(controller.getUser(adminUser, 'db_user_1')).resolves.toBe(
      profile,
    );

    expect(adminUsersService.getUser).toHaveBeenCalledWith(
      adminUser,
      'db_user_1',
    );
  });

  it('delegates admin user updates', async () => {
    const patch = {
      hasCompletedOnboarding: true,
    };

    await expect(
      controller.updateUser(adminUser, 'db_user_1', patch),
    ).resolves.toBe(profile);

    expect(adminUsersService.updateUser).toHaveBeenCalledWith(
      adminUser,
      'db_user_1',
      patch,
    );
  });
});
