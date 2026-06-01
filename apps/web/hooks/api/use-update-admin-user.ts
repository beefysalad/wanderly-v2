import { useAuth } from "@clerk/nextjs"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { UpdateAdminUserRequest } from "@workspace/shared"

import { updateAdminUser } from "@/lib/api/admin-users"

type UpdateAdminUserInput = {
  userId: string
  input: UpdateAdminUserRequest
}

function useUpdateAdminUser() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, input }: UpdateAdminUserInput) => {
      const token = await getToken()
      if (!token) throw new Error("No token found")
      return updateAdminUser(token, userId, input)
    },
    onSuccess: async (user) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
        queryClient.invalidateQueries({
          queryKey: ["admin", "users", user.id],
        }),
      ])
    },
  })
}

export { useUpdateAdminUser }
