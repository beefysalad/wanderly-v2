"use client"

import { useAuth } from "@clerk/nextjs"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { UpdateMobileStatusRequest } from "@workspace/shared"

import { mobileStatusQueryKey } from "@/hooks/api/use-mobile-status"
import { updateAdminMobileStatus } from "@/lib/api/app-config"

function useUpdateMobileStatus() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdateMobileStatusRequest) => {
      const token = await getToken()
      if (!token) throw new Error("No token found")
      return updateAdminMobileStatus(token, input)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: mobileStatusQueryKey })
    },
  })
}

export { useUpdateMobileStatus }
