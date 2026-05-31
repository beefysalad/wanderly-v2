import { useAuth } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query"
import type { GetAdminUsersResponse } from "@workspace/shared"

import { getAdminUsers } from "@/lib/api/admin-users"

function useAdminUsers() {
  const { getToken, isLoaded, isSignedIn } = useAuth()

  return useQuery<GetAdminUsersResponse>({
    queryKey: ["admin", "users"],
    enabled: isLoaded && isSignedIn,
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error("No token found")
      return getAdminUsers(token)
    },
  })
}

export { useAdminUsers }
