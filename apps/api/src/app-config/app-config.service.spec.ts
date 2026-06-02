import { ForbiddenException } from "@nestjs/common"
import { AppConfigService } from "./app-config.service"
import type { AppConfigRepository } from "./app-config.repository"

describe("AppConfigService", () => {
  const adminUser = {
    clerkId: "admin_123",
    isAdmin: true,
  }

  const regularUser = {
    clerkId: "user_123",
    isAdmin: false,
  }

  let repository: jest.Mocked<
    Pick<AppConfigRepository, "getMobileStatus" | "setMobileStatus">
  >
  let service: AppConfigService

  beforeEach(() => {
    repository = {
      getMobileStatus: jest.fn().mockResolvedValue(null),
      setMobileStatus: jest.fn().mockImplementation(async (value) => ({
        value,
        updatedAt: new Date("2026-06-01T12:00:00.000Z"),
      })),
    }
    service = new AppConfigService(repository as unknown as AppConfigRepository)
  })

  it("returns an available mobile status when no config exists", async () => {
    await expect(service.getMobileStatus()).resolves.toEqual({
      maintenanceEnabled: false,
      title: "Wanderly is under maintenance",
      message: "We are making updates to Wanderly. Please check back soon.",
      updatedAt: null,
    })
  })

  it("rejects admin reads for non-admins", async () => {
    await expect(
      service.getAdminMobileStatus(regularUser)
    ).rejects.toBeInstanceOf(ForbiddenException)

    expect(repository.getMobileStatus).not.toHaveBeenCalled()
  })

  it("updates mobile status for admins", async () => {
    await expect(
      service.updateMobileStatus(adminUser, {
        maintenanceEnabled: true,
        title: "Wanderly is offline",
        message: "We are shipping a database update.",
      })
    ).resolves.toEqual({
      maintenanceEnabled: true,
      title: "Wanderly is offline",
      message: "We are shipping a database update.",
      updatedAt: "2026-06-01T12:00:00.000Z",
    })

    expect(repository.setMobileStatus).toHaveBeenCalledWith({
      maintenanceEnabled: true,
      title: "Wanderly is offline",
      message: "We are shipping a database update.",
    })
  })
})
