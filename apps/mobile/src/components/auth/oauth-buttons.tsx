import * as Linking from "expo-linking"
import * as WebBrowser from "expo-web-browser"
import { useSSO } from "@clerk/expo"
import { ActivityIndicator, Pressable, View } from "react-native"
import { useState } from "react"

import { AppleLogo } from "@/components/auth/apple-logo"
import { GoogleLogo } from "@/components/auth/google-logo"

WebBrowser.maybeCompleteAuthSession()

type Props = {
  onError?: (err: string) => void
}

export function OAuthButtons({ onError }: Props) {
  const { startSSOFlow } = useSSO()
  const [loading, setLoading] = useState<"google" | "apple" | null>(null)

  async function handleGoogle() {
    try {
      setLoading("google")
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: Linking.createURL("/"),
      })
      if (createdSessionId && setActive)
        await setActive({ session: createdSessionId })
    } catch {
      onError?.("Google sign in failed. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  async function handleApple() {
    try {
      setLoading("apple")
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_apple",
        redirectUrl: Linking.createURL("/"),
      })
      if (createdSessionId && setActive)
        await setActive({ session: createdSessionId })
    } catch {
      onError?.("Apple sign in failed. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  return (
    <View className="flex-row items-center justify-center gap-3">
      <Pressable
        accessibilityLabel="Continue with Google"
        disabled={loading !== null}
        onPress={handleGoogle}
        className="h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50"
      >
        {loading === "google" ? (
          <ActivityIndicator color="#208AEF" />
        ) : (
          <GoogleLogo size={20} />
        )}
      </Pressable>

      <Pressable
        accessibilityLabel="Continue with Apple"
        disabled={loading !== null}
        onPress={handleApple}
        className="h-12 w-12 items-center justify-center rounded-full bg-black"
      >
        {loading === "apple" ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <AppleLogo color="#FFFFFF" size={20} />
        )}
      </Pressable>
    </View>
  )
}
