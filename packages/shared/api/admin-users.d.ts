import type { AuthProvider, TravelStyle, UserProfile } from "./users"

export type AdminUser = {
  id: string
  clerkId: string
  email: string
  name: string | null
  imageUrl: string | null
  authProviders: AuthProvider[]
  travelStyle: TravelStyle
  hasCompletedOnboarding: boolean
  createdAt: string
  updatedAt: string
}

export type AdminUserDetail = UserProfile & {
  createdAt: string
  updatedAt: string
}

export type GetAdminUsersResponse = {
  users: AdminUser[]
}

export type UpdateAdminUserRequest = {
  hasCompletedOnboarding?: boolean
}
