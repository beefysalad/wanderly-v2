export type TravelStyle = "BUDGET" | "MID_RANGE" | "LUXURY"

export type AuthProvider = "GOOGLE" | "APPLE"

export type UserProfile = {
  id: string
  clerkId: string
  email: string
  name: string | null
  photoUrl: string | null
  authProviders: AuthProvider[]
  bio: string | null
  travelStyle: TravelStyle
  interests: string[]
  hasCompletedOnboarding: boolean
}

export type UpdateUserProfileRequest = {
  name?: string | null
  photoUrl?: string | null
  bio?: string | null
  travelStyle?: TravelStyle
  interests?: string[]
  hasCompletedOnboarding?: boolean
}

export type CurrentUserResponse = {
  id: string
  clerkId: string
  email: string
  name: string
  imageUrl: string | null
  authProviders: AuthProvider[]
}

export type User = {
  id: string
  clerkId: string
  name: string
  email: string
  imageUrl: string | null
  authProviders: AuthProvider[]
}
