import { useAuth } from "@clerk/expo"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "expo-router"
import { useState } from "react"
import { Alert, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

// Placeholder — will be built out in a later ticket
export default function ProfileScreen() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { signOut } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleSignOut() {
    setIsSigningOut(true)

    try {
      await signOut()
      queryClient.clear()
      router.replace("/(auth)/sign-in")
    } catch {
      Alert.alert("Could not log out", "Please try again.")
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">
      <View className="flex-1 items-center justify-center gap-5 px-6">
        <Text className="text-4xl">👤</Text>
        <View className="items-center gap-2">
          <Text className="text-xl font-bold text-zinc-900 dark:text-white">
            Profile
          </Text>
          <Text className="text-sm text-zinc-500 dark:text-zinc-400">
            Account settings coming soon
          </Text>
        </View>
        <Button
          className="mt-2 w-full max-w-sm"
          loading={isSigningOut}
          onPress={handleSignOut}
          variant="default"
        >
          <Text>Log out</Text>
        </Button>
      </View>
    </SafeAreaView>
  )
}
