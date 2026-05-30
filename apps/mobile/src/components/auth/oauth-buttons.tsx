import * as Linking from "expo-linking"
import * as WebBrowser from "expo-web-browser"
import { useSSO } from "@clerk/expo"
import { View } from "react-native"
import { useState } from "react"

import { AppleLogo } from "@/components/auth/apple-logo"
import { Button } from "@/components/ui/button"
import { GoogleLogo } from "@/components/auth/google-logo"
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
    <View className="flex-row gap-3">
      <Button
        className="flex-1"
        onPress={handleGoogle}
        loading={loadingGoogle}
        loadingColor="#208AEF"
        size="sm"
        variant="outline"
      >
        <GoogleLogo />
        {/* <Text>Google</Text> */}
      </Button>

      <Button
        className="flex-1"
        onPress={handleApple}
        loading={loadingApple}
        size="sm"
        variant="default"
      >
        <AppleLogo />
        {/* <Text>Apple</Text> */}
      </Button>
    </View>
  )
}
