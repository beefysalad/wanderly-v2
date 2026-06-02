import { AppConfigController } from "./app-config.controller"
import type { AppConfigService } from "./app-config.service"

describe("AppConfigController", () => {
  const adminUser = {
    clerkId: "admin_123",
    isAdmin: true,
  }

  const status = {
    maintenanceEnabled: true,
    title: "Wanderly is offline",
    message: "We are shipping a database update.",
    updatedAt: "2026-06-01T12:00:00.000Z",
  }

  let service: jest.Mocked<
    Pick<
      AppConfigService,
      "getAdminMobileStatus" | "getMobileStatus" | "updateMobileStatus"
    >
  >
  let controller: AppConfigController

  beforeEach(() => {
    service = {
      getAdminMobileStatus: jest.fn().mockResolvedValue(status),
      getMobileStatus: jest.fn().mockResolvedValue(status),
      updateMobileStatus: jest.fn().mockResolvedValue(status),
    }
    controller = new AppConfigController(service as unknown as AppConfigService)
  })

  it("delegates public mobile status reads", async () => {
    await expect(controller.getMobileStatus()).resolves.toBe(status)

    expect(service.getMobileStatus).toHaveBeenCalledTimes(1)
  })

  it("delegates admin mobile status reads", async () => {
    await expect(controller.getAdminMobileStatus(adminUser)).resolves.toBe(
      status
    )

    expect(service.getAdminMobileStatus).toHaveBeenCalledWith(adminUser)
  })

  it("delegates admin mobile status updates", async () => {
    const input = {
      maintenanceEnabled: true,
      title: "Wanderly is offline",
      message: "We are shipping a database update.",
    }

    await expect(controller.updateMobileStatus(adminUser, input)).resolves.toBe(
      status
    )

    expect(service.updateMobileStatus).toHaveBeenCalledWith(adminUser, input)
  })
})
