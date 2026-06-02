export type MobileStatusResponse = {
  maintenanceEnabled: boolean
  title: string
  message: string
  updatedAt: string | null
}

export type UpdateMobileStatusRequest = {
  maintenanceEnabled: boolean
  title?: string
  message?: string
}
