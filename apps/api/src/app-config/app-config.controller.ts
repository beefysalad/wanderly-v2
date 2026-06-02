import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common"
import type {
  MobileStatusResponse,
  UpdateMobileStatusRequest,
} from "@workspace/shared"
import {
  CurrentUser,
  type CurrentUser as CurrentUserPayload,
} from "../common/decorators/current-user.decorator"
import { ClerkGuard } from "../common/guards/clerk.guard"
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe"
import {
  updateMobileStatusSchema,
  type UpdateMobileStatusDto,
} from "./dto/update-mobile-status.dto"
import { AppConfigService } from "./app-config.service"

@Controller()
export class AppConfigController {
  constructor(private readonly appConfigService: AppConfigService) {}

  @Get("app-config/mobile-status")
  getMobileStatus(): Promise<MobileStatusResponse> {
    return this.appConfigService.getMobileStatus()
  }

  @Get("admin/app-config/mobile-status")
  @UseGuards(ClerkGuard)
  getAdminMobileStatus(
    @CurrentUser() currentUser: CurrentUserPayload
  ): Promise<MobileStatusResponse> {
    return this.appConfigService.getAdminMobileStatus(currentUser)
  }

  @Patch("admin/app-config/mobile-status")
  @UseGuards(ClerkGuard)
  updateMobileStatus(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Body(new ZodValidationPipe(updateMobileStatusSchema))
    input: UpdateMobileStatusDto
  ): Promise<MobileStatusResponse> {
    return this.appConfigService.updateMobileStatus(
      currentUser,
      input satisfies UpdateMobileStatusRequest
    )
  }
}
