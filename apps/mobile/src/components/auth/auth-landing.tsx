import { useSSO } from "@clerk/expo"
import { LinearGradient } from "expo-linear-gradient"
import * as Linking from "expo-linking"
import { useRouter } from "expo-router"
import * as WebBrowser from "expo-web-browser"
import { ArrowRight } from "lucide-react-native"
import { useState } from "react"
import { ActivityIndicator, Pressable, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { AuthLandingImageCarousel } from "@/components/auth/auth-landing-image-carousel"
import { AppleLogo } from "@/components/auth/apple-logo"
import { GoogleLogo } from "@/components/auth/google-logo"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

WebBrowser.maybeCompleteAuthSession()

/** 01 · Sign in — full-bleed welcome landing. */
export function AuthLanding() {
  const router = useRouter()
  const { startSSOFlow } = useSSO()
  const [loading, setLoading] = useState<"google" | "apple" | null>(null)

  async function handleSSO(strategy: "oauth_google" | "oauth_apple") {
    const key = strategy === "oauth_google" ? "google" : "apple"
    try {
      setLoading(key)
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl: Linking.createURL("/"),
      })
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId })
      }
    } catch {
      // surfaced via the email path; keep the landing quiet on cancel
    } finally {
      setLoading(null)
    }
  }

  return (
    <View className="flex-1 bg-black">
      <AuthLandingImageCarousel />
      <LinearGradient
        colors={[
          "rgba(0,0,0,0.18)",
          "rgba(0,0,0,0.08)",
          "rgba(0,0,0,0.72)",
          "#000000",
        ]}
        locations={[0, 0.42, 0.76, 1]}
        style={{ position: "absolute", inset: 0 }}
      />

      <SafeAreaView edges={["top", "bottom"]} className="flex-1">
        <View className="flex-1 justify-between px-6 pb-7 pt-14">
          <View>
            <Text className="text-[58px] font-extrabold leading-[0.92] text-white">
              Wanderly
            </Text>
          </View>

          <View>
            <View className="mb-6">
              <Text className="max-w-[330px] text-[31px] font-extrabold leading-[1.08] text-white">
                Plan the trip. Keep the story.
              </Text>
              <Text className="mt-3 max-w-[295px] text-base leading-relaxed text-white/70">
                Build solo plans, group itineraries, budgets, and travel
                memories from one place.
              </Text>
            </View>

            <View className="gap-3">
              <Pressable
                onPress={() => router.push("/(auth)/sign-up")}
                disabled={loading !== null}
                className="h-14 flex-row items-center justify-center gap-2.5 rounded-full bg-white"
              >
                <Text className="text-[17px] font-bold text-black">
                  Get started
                </Text>
                <Icon as={ArrowRight} size={20} className="text-black" />
              </Pressable>

              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => handleSSO("oauth_google")}
                  disabled={loading !== null}
                  className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10"
                >
                  {loading === "google" ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <GoogleLogo size={18} />
                      <Text className="text-[15px] font-bold text-white">
                        Google
                      </Text>
                    </>
                  )}
                </Pressable>

                <Pressable
                  onPress={() => handleSSO("oauth_apple")}
                  disabled={loading !== null}
                  className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10"
                >
                  {loading === "apple" ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <AppleLogo size={18} color="#fff" />
                      <Text className="text-[15px] font-bold text-white">
                        Apple
                      </Text>
                    </>
                  )}
                </Pressable>
              </View>

              <Pressable
                onPress={() => router.push("/(auth)/sign-in")}
                className="mt-1 flex-row justify-center py-1"
              >
                <Text className="text-[13.5px] text-white/70">
                  Already exploring?{" "}
                  <Text className="font-bold text-white">Log in</Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}
