import { ForbiddenException, Injectable } from "@nestjs/common"
import type {
  MobileStatusResponse,
  UpdateMobileStatusRequest,
} from "@workspace/shared"
import type { CurrentUser } from "../common/decorators/current-user.decorator"
import { DEFAULT_MOBILE_STATUS } from "./app-config.constants"
import {
  AppConfigRepository,
  type AppConfigRecord,
  type MobileStatusConfigValue,
} from "./app-config.repository"

@Injectable()
export class AppConfigService {
  constructor(private readonly appConfigRepository: AppConfigRepository) {}

  async getMobileStatus(): Promise<MobileStatusResponse> {
    const config = await this.appConfigRepository.getMobileStatus()

    return this._toMobileStatusResponse(config)
  }

  async getAdminMobileStatus(
    currentUser: CurrentUser
  ): Promise<MobileStatusResponse> {
    this._assertAdmin(currentUser)

    return this.getMobileStatus()
  }

  async updateMobileStatus(
    currentUser: CurrentUser,
    input: UpdateMobileStatusRequest
  ): Promise<MobileStatusResponse> {
    this._assertAdmin(currentUser)

    const existingConfig = await this.appConfigRepository.getMobileStatus()
    const existingValue = this._toMobileStatusValue(existingConfig?.value)
    const nextValue: MobileStatusConfigValue = {
      maintenanceEnabled: input.maintenanceEnabled,
      title: this._normalizeText(input.title, existingValue.title),
      message: this._normalizeText(input.message, existingValue.message),
    }
    const config = await this.appConfigRepository.setMobileStatus(nextValue)

    return this._toMobileStatusResponse(config)
  }

  private _assertAdmin(currentUser: CurrentUser): void {
    if (!currentUser.isAdmin) {
      throw new ForbiddenException("Admin access is required")
    }
  }

  private _toMobileStatusResponse(
    config: AppConfigRecord | null
  ): MobileStatusResponse {
    const value = this._toMobileStatusValue(config?.value)

    return {
      ...value,
      updatedAt: config?.updatedAt.toISOString() ?? null,
    }
  }

  private _toMobileStatusValue(value: unknown): MobileStatusConfigValue {
    if (!this._isRecord(value)) {
      return { ...DEFAULT_MOBILE_STATUS }
    }

    return {
      maintenanceEnabled:
        typeof value.maintenanceEnabled === "boolean"
          ? value.maintenanceEnabled
          : DEFAULT_MOBILE_STATUS.maintenanceEnabled,
      title:
        typeof value.title === "string" && value.title.trim()
          ? value.title.trim()
          : DEFAULT_MOBILE_STATUS.title,
      message:
        typeof value.message === "string" && value.message.trim()
          ? value.message.trim()
          : DEFAULT_MOBILE_STATUS.message,
    }
  }

  private _normalizeText(value: string | undefined, fallback: string): string {
    const trimmed = value?.trim()

    return trimmed || fallback
  }

  private _isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value)
  }
}
