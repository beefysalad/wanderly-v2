import * as Linking from "expo-linking"
import * as WebBrowser from "expo-web-browser"
import { useSSO } from "@clerk/expo"
import { Apple } from "lucide-react-native"
import { View } from "react-native"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

WebBrowser.maybeCompleteAuthSession()

type Props = {
  onError?: (err: string) => void
}

export function OAuthButtons({ onError }: Props) {
  const { startSSOFlow } = useSSO()
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [loadingApple, setLoadingApple] = useState(false)

  async function handleGoogle() {
    try {
      setLoadingGoogle(true)
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: Linking.createURL("/"),
      })
      if (createdSessionId && setActive)
        await setActive({ session: createdSessionId })
    } catch {
      onError?.("Google sign in failed. Please try again.")
    } finally {
      setLoadingGoogle(false)
    }
  }

  async function handleApple() {
    try {
      setLoadingApple(true)
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_apple",
        redirectUrl: Linking.createURL("/"),
      })
      if (createdSessionId && setActive)
        await setActive({ session: createdSessionId })
    } catch {
      onError?.("Apple sign in failed. Please try again.")
    } finally {
      setLoadingApple(false)
    }
  }

  return (
    <View className="gap-3">
      {/* Google */}
      <Button
        onPress={handleGoogle}
        loading={loadingGoogle}
        loadingColor="#208AEF"
        variant="outline"
      >
        <View className="h-5 w-5 items-center justify-center rounded-full bg-[#4285F4]">
          <Text className="text-[10px] font-bold text-white">G</Text>
        </View>
        <Text className="text-sm font-semibold">Continue with Google</Text>
      </Button>

      {/* Apple */}
      <Button onPress={handleApple} loading={loadingApple} variant="default">
        <Icon as={Apple} className="text-primary-foreground" size={18} />
        <Text className="text-sm font-semibold">Continue with Apple</Text>
      </Button>
    </View>
  )
}
