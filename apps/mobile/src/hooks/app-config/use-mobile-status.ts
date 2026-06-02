import { useQuery } from "@tanstack/react-query"

import { getMobileStatus } from "@/lib/api/app-config"

const mobileStatusQueryKey = ["app-config", "mobile-status"] as const

export function useMobileStatus() {
  return useQuery({
    queryKey: mobileStatusQueryKey,
    queryFn: getMobileStatus,
    refetchInterval: 60_000,
    retry: false,
  })
}

export { mobileStatusQueryKey }
