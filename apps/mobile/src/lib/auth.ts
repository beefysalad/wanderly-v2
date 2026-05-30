import { useAuth } from "@clerk/expo"
import { useEffect } from "react"

import { apiClient } from "@/lib/axios"

export function useAuthedClient() {
  const { getToken } = useAuth()

  useEffect(() => {
    const interceptorId = apiClient.interceptors.request.use(async (config) => {
      const token = await getToken()

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    })

    return () => {
      apiClient.interceptors.request.eject(interceptorId)
    }
  }, [getToken])

  return apiClient
}
