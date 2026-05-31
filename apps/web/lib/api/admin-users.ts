import type {
  AdminUserDetail,
  GetAdminUsersResponse,
  UpdateAdminUserRequest,
} from "@workspace/shared"

import { apiClient } from "@/lib/axios"

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  }
}

async function getAdminUsers(token: string): Promise<GetAdminUsersResponse> {
  const response = await apiClient.get<GetAdminUsersResponse>("/admin/users", {
    headers: authHeaders(token),
  })

  return response.data
}

async function getAdminUser(
  token: string,
  userId: string
): Promise<AdminUserDetail> {
  const response = await apiClient.get<AdminUserDetail>(
    `/admin/users/${userId}`,
    {
      headers: authHeaders(token),
    }
  )

  return response.data
}

async function updateAdminUser(
  token: string,
  userId: string,
  input: UpdateAdminUserRequest
): Promise<AdminUserDetail> {
  const response = await apiClient.patch<AdminUserDetail>(
    `/admin/users/${userId}`,
    input,
    {
      headers: authHeaders(token),
    }
  )

  return response.data
}

export { getAdminUser, getAdminUsers, updateAdminUser }
export type { AdminUserDetail, GetAdminUsersResponse, UpdateAdminUserRequest }
