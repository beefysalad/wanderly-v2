import { useAuth } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query"
import type { AdminUserDetail } from "@workspace/shared"

import { getAdminUser } from "@/lib/api/admin-users"

function useAdminUser(userId: string) {
  const { getToken, isLoaded, isSignedIn } = useAuth()

  return useQuery<AdminUserDetail>({
    queryKey: ["admin", "users", userId],
    enabled: isLoaded && isSignedIn && userId.length > 0,
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error("No token found")
      return getAdminUser(token, userId)
    },
  })
}

export { useAdminUser }
