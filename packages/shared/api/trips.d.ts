export type TripStatus = "PLANNING" | "COMPLETED" | "CANCELLED"

export type TripStatusInput = "planning" | "completed" | "cancelled"

export type RsvpStatus = "GOING" | "MAYBE" | "NOT_GOING" | "PENDING"

export type RsvpStatusInput = "going" | "maybe" | "not_going"

export type Trip = {
  id: string
  groupId: string | null
  createdById: string
  name: string
  destination: string | null
  startDate: string | null
  endDate: string | null
  status: TripStatus
  currency: string
  budget: string | null
  aiGenerated: boolean
  createdAt: string
  updatedAt: string
}

export type CreateTripRequest = {
  name: string
  destination?: string | null
  startDate?: string | null
  endDate?: string | null
  groupId?: string | null
  budget?: string | null
  currency?: string
}

export type UpdateTripRequest = {
  name?: string
  destination?: string | null
  startDate?: string | null
  endDate?: string | null
  status?: TripStatusInput
  budget?: string | null
  currency?: string
}

export type AttachTripToGroupRequest = {
  groupId: string
}

export type TripRsvp = {
  id: string
  tripId: string
  userId: string
  status: RsvpStatus
  updatedAt: string
}

export type UpdateTripRsvpRequest = {
  status: RsvpStatusInput
}
