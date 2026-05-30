import { isAxiosError } from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useAuthedClient } from "@/lib/auth"
import {
  syncCurrentUser,
  updateCurrentUser,
  type UpdateUserPayload,
} from "@/lib/api/users"

function isMissingUserProfileError(error: unknown) {
  return isAxiosError(error) && error.response?.status === 404
}

export function useUpdateUser() {
  useAuthedClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateUserPayload) => {
      try {
        return await updateCurrentUser(payload)
      } catch (error) {
        if (!isMissingUserProfileError(error)) {
          throw error
        }

        await syncCurrentUser()
        return await updateCurrentUser(payload)
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["users", "me"], data)
    },
  })
}
