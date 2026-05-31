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
import { Throttle } from '@nestjs/throttler';
import type { CurrentUserResponse, UserProfile } from '@workspace/shared';
import {
  CurrentUser,
  type CurrentUser as CurrentUserPayload,
} from '../common/decorators/current-user.decorator';
import { ClerkGuard } from '../common/guards/clerk.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createThrottleOverride } from '../common/rate-limit/rate-limit.config';
import {
  updateUserProfileSchema,
  type UpdateUserProfileDto,
} from './dto/update-user-profile.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(ClerkGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Authenticated self-healing fallback for first-session webhook races.
  @Post('me/sync')
  @Throttle(
    createThrottleOverride(
      'API_USER_SYNC_RATE_LIMIT_MAX_REQUESTS',
      'API_USER_SYNC_RATE_LIMIT_TTL_MS',
      20,
      60000,
    ),
  )
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
    @Body(new ZodValidationPipe(updateUserProfileSchema))
    input: UpdateUserProfileDto,
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
}
