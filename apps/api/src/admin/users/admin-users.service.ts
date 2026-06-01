import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  AdminUserDetail,
  GetAdminUsersResponse,
  UpdateAdminUserRequest,
} from '@workspace/shared';
import type { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UsersRepository } from '../../users/users.repository';

@Injectable()
export class AdminUsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUsers(currentUser: CurrentUser): Promise<GetAdminUsersResponse> {
    this._assertAdmin(currentUser);

    const users = await this.usersRepository.getAdminUsers();

    return { users };
  }

  async getUser(
    currentUser: CurrentUser,
    userId: string,
  ): Promise<AdminUserDetail> {
    this._assertAdmin(currentUser);

    const user = await this.usersRepository.findAdminUserById(userId);

    if (!user) {
      throw new NotFoundException('Admin user not found');
    }

    return user;
  }

  async updateUser(
    currentUser: CurrentUser,
    userId: string,
    input: UpdateAdminUserRequest,
  ): Promise<AdminUserDetail> {
    this._assertAdmin(currentUser);

    const user = await this.usersRepository.updateAdminUserById(userId, input);

    if (!user) {
      throw new NotFoundException('Admin user not found');
    }

    return user;
  }

  private _assertAdmin(currentUser: CurrentUser): void {
    if (!currentUser.isAdmin) {
      throw new ForbiddenException('Admin access is required');
    }
  }
}
