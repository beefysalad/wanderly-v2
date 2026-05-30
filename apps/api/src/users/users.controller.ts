import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import type {
  CurrentUserResponse,
  GetAllUsersResponse,
} from '@workspace/shared';
import {
  CurrentUser,
  type CurrentUser as CurrentUserPayload,
} from '../common/decorators/current-user.decorator';
import { ClerkGuard } from '../common/guards/clerk.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(ClerkGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('me/sync')
  syncCurrentUser(
    @CurrentUser() currentUser: CurrentUserPayload,
  ): Promise<CurrentUserResponse> {
    return this.usersService.syncCurrentUser(currentUser.clerkId);
  }

  @Get('me')
  getCurrentUser(
    @CurrentUser() currentUser: CurrentUserPayload,
  ): Promise<CurrentUserResponse> {
    return this.usersService.syncCurrentUser(currentUser.clerkId);
  }

  @Get('all')
  async getAllUsers(): Promise<GetAllUsersResponse> {
    return await this.usersService.getAllUsers();
  }
}
