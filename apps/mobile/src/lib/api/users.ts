import type {
  CurrentUserResponse,
  TravelStyle,
  UpdateUserProfileRequest,
  UserProfile,
} from "@workspace/shared"

import { apiClient } from "@/lib/axios"

export type { TravelStyle, UserProfile }
export type UpdateUserPayload = UpdateUserProfileRequest

export async function getCurrentUser(): Promise<UserProfile> {
  const res = await apiClient.get<UserProfile>("/users/me")
  return res.data
}

export async function syncCurrentUser(): Promise<CurrentUserResponse> {
  const res = await apiClient.post<CurrentUserResponse>("/users/me/sync")
  return res.data
}

export async function updateCurrentUser(
  payload: UpdateUserPayload
): Promise<UserProfile> {
  const res = await apiClient.patch<UserProfile>("/users/me", payload)
  return res.data
}

export async function deleteCurrentUser(): Promise<void> {
  await apiClient.delete("/users/me")
}
