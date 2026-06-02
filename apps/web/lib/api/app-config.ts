import type {
  MobileStatusResponse,
  UpdateMobileStatusRequest,
} from "@workspace/shared"

import { apiClient } from "@/lib/axios"

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  }
}

async function getAdminMobileStatus(
  token: string
): Promise<MobileStatusResponse> {
  const response = await apiClient.get<MobileStatusResponse>(
    "/admin/app-config/mobile-status",
    {
      headers: authHeaders(token),
    }
  )

  return response.data
}

async function updateAdminMobileStatus(
  token: string,
  input: UpdateMobileStatusRequest
): Promise<MobileStatusResponse> {
  const response = await apiClient.patch<MobileStatusResponse>(
    "/admin/app-config/mobile-status",
    input,
    {
      headers: authHeaders(token),
    }
  )

  return response.data
}

export { getAdminMobileStatus, updateAdminMobileStatus }
export type { MobileStatusResponse, UpdateMobileStatusRequest }
