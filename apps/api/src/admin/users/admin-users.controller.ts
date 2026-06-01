import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import type { AdminUserDetail, GetAdminUsersResponse } from '@workspace/shared';
import {
  CurrentUser,
  type CurrentUser as CurrentUserPayload,
} from '../../common/decorators/current-user.decorator';
import { ClerkGuard } from '../../common/guards/clerk.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  updateAdminUserSchema,
  type UpdateAdminUserDto,
} from './dto/update-admin-user.dto';
import { AdminUsersService } from './admin-users.service';

@Controller('admin/users')
@UseGuards(ClerkGuard)
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  getUsers(
    @CurrentUser() currentUser: CurrentUserPayload,
  ): Promise<GetAdminUsersResponse> {
    return this.adminUsersService.getUsers(currentUser);
  }

  @Get(':userId')
  getUser(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param('userId') userId: string,
  ): Promise<AdminUserDetail> {
    return this.adminUsersService.getUser(currentUser, userId);
  }

  @Patch(':userId')
  updateUser(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param('userId') userId: string,
    @Body(new ZodValidationPipe(updateAdminUserSchema))
    input: UpdateAdminUserDto,
  ): Promise<AdminUserDetail> {
    return this.adminUsersService.updateUser(currentUser, userId, input);
  }
}
