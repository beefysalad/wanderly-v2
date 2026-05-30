import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import type {
  CurrentUserResponse,
  GetAllUsersResponse,
  UserProfile,
} from '@workspace/shared';
import {
  CurrentUser,
  type CurrentUser as CurrentUserPayload,
} from '../common/decorators/current-user.decorator';
import { ClerkGuard } from '../common/guards/clerk.guard';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
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
  ): Promise<UserProfile> {
    return this.usersService.getCurrentUser(currentUser.clerkId);
  }

  @Patch('me')
  updateCurrentUser(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Body() input: UpdateUserProfileDto,
  ): Promise<UserProfile> {
    return this.usersService.updateCurrentUser(currentUser.clerkId, input);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCurrentUser(
    @CurrentUser() currentUser: CurrentUserPayload,
  ): Promise<void> {
    await this.usersService.deleteCurrentUser(currentUser.clerkId);
  }

  @Get('all')
  async getAllUsers(): Promise<GetAllUsersResponse> {
    return await this.usersService.getAllUsers();
  }
}
