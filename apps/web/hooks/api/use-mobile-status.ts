"use client"

import { useAuth } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query"
import type { MobileStatusResponse } from "@workspace/shared"

import { getAdminMobileStatus } from "@/lib/api/app-config"

const mobileStatusQueryKey = ["admin", "app-config", "mobile-status"] as const

function useMobileStatus() {
  const { getToken, isLoaded, isSignedIn } = useAuth()

  return useQuery<MobileStatusResponse>({
    queryKey: mobileStatusQueryKey,
    enabled: isLoaded && isSignedIn,
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error("No token found")
      return getAdminMobileStatus(token)
    },
  })
}

export { mobileStatusQueryKey, useMobileStatus }
