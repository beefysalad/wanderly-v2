import type { MobileStatusResponse } from "@workspace/shared"

import { apiClient } from "@/lib/axios"

export async function getMobileStatus(): Promise<MobileStatusResponse> {
  const response = await apiClient.get<MobileStatusResponse>(
    "/app-config/mobile-status"
  )

  return response.data
}

export type { MobileStatusResponse }
