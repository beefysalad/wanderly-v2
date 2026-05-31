import { useAuth } from "@clerk/expo"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "expo-router"
import { useCallback, useState } from "react"
import { Alert } from "react-native"

function useSignOut() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { signOut: clerkSignOut } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const signOut = useCallback(async () => {
    setIsSigningOut(true)

    try {
      await clerkSignOut()
      queryClient.clear()
      router.replace("/(auth)/sign-in")
    } catch {
      Alert.alert("Could not log out", "Please try again.")
    } finally {
      setIsSigningOut(false)
    }
  }, [clerkSignOut, queryClient, router])

  return { signOut, isSigningOut }
}

export { useSignOut }
