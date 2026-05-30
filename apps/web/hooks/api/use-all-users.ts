import { useAuth } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query"
import type { GetAllUsersResponse } from "@workspace/shared"

import { getAllUsers } from "@/lib/api/users"

export function useAllUsers() {
  const { getToken, isLoaded, isSignedIn } = useAuth()

  return useQuery<GetAllUsersResponse>({
    queryKey: ["users", "all"],
    enabled: isLoaded && isSignedIn,
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error("No token found")
      return getAllUsers(token)
    },
  })
}
