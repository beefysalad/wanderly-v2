import { HttpStatus } from '@nestjs/common';
import { UsersController } from './users.controller';
import type { UsersService } from './users.service';

describe('UsersController', () => {
  const currentUser = {
    clerkId: 'user_123',
  };

  const profile = {
    id: 'db_user_1',
    clerkId: 'user_123',
    email: 'pat@example.com',
    name: 'Patrick',
    photoUrl: 'https://example.com/avatar.png',
    bio: 'Traveler',
    travelStyle: 'BUDGET' as const,
    interests: ['food', 'beaches'],
  };

  let usersService: jest.Mocked<
    Pick<
      UsersService,
      'deleteCurrentUser' | 'getCurrentUser' | 'updateCurrentUser'
    >
  >;
  let controller: UsersController;

  beforeEach(() => {
    usersService = {
      deleteCurrentUser: jest.fn().mockResolvedValue(undefined),
      getCurrentUser: jest.fn().mockResolvedValue(profile),
      updateCurrentUser: jest.fn().mockResolvedValue(profile),
    };
    controller = new UsersController(usersService as unknown as UsersService);
  });

  it('returns the current DB user profile from the Clerk subject', async () => {
    await expect(controller.getCurrentUser(currentUser)).resolves.toBe(profile);

    expect(usersService.getCurrentUser).toHaveBeenCalledWith('user_123');
  });

  it('updates only the provided current user profile fields', async () => {
    const patch = {
      interests: ['food'],
      name: 'Pat',
    };

    await expect(
      controller.updateCurrentUser(currentUser, patch),
    ).resolves.toBe(profile);

    expect(usersService.updateCurrentUser).toHaveBeenCalledWith(
      'user_123',
      patch,
    );
  });

  it('deletes the current user and returns 204', async () => {
    const deleteCurrentUserHandler = Object.getOwnPropertyDescriptor(
      UsersController.prototype,
      'deleteCurrentUser',
    )?.value as () => Promise<void>;

    expect(Reflect.getMetadata('__httpCode__', deleteCurrentUserHandler)).toBe(
      HttpStatus.NO_CONTENT,
    );

    await expect(
      controller.deleteCurrentUser(currentUser),
    ).resolves.toBeUndefined();
    expect(usersService.deleteCurrentUser).toHaveBeenCalledWith('user_123');
  });
});
