import { Injectable } from "@nestjs/common"
import type { UpdateMobileStatusRequest } from "@workspace/shared"
import { PrismaService } from "../prisma/prisma.service"
import { MOBILE_STATUS_CONFIG_KEY } from "./app-config.constants"

type AppConfigRecord = {
  value: unknown
  updatedAt: Date
}

type MobileStatusConfigValue = Required<UpdateMobileStatusRequest>

@Injectable()
export class AppConfigRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getMobileStatus(): Promise<AppConfigRecord | null> {
    return this.prisma.db.appConfig.findUnique({
      where: {
        key: MOBILE_STATUS_CONFIG_KEY,
      },
      select: {
        value: true,
        updatedAt: true,
      },
    })
  }

  async setMobileStatus(
    value: MobileStatusConfigValue
  ): Promise<AppConfigRecord> {
    return this.prisma.db.appConfig.upsert({
      where: {
        key: MOBILE_STATUS_CONFIG_KEY,
      },
      update: {
        value,
      },
      create: {
        key: MOBILE_STATUS_CONFIG_KEY,
        value,
      },
      select: {
        value: true,
        updatedAt: true,
      },
    })
  }
}

export type { AppConfigRecord, MobileStatusConfigValue }
