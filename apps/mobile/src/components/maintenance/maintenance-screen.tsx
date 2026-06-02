import { LinearGradient } from "expo-linear-gradient"
import { RefreshCw } from "lucide-react-native"
import { ActivityIndicator, Pressable, View } from "react-native"
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated"
import { SafeAreaView } from "react-native-safe-area-context"

import { AuthLandingImageCarousel } from "@/components/auth/auth-landing-image-carousel"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

type MaintenanceScreenProps = {
  title: string
  message: string
  updatedAt: string | null
  isRefreshing: boolean
  onRetry: () => void
}

const FALLBACK_TITLE = "Wanderly is taking a short break"
const FALLBACK_MESSAGE =
  "We are making a few updates. Please check again in a bit."
const TEXT_SHADOW = {
  textShadowColor: "rgba(0,0,0,0.35)",
  textShadowOffset: { height: 1, width: 0 },
  textShadowRadius: 14,
} as const
const BRAND_TEXT_STYLE = {
  ...TEXT_SHADOW,
  color: "#FFFFFF",
  fontSize: 62,
  fontWeight: "900",
  lineHeight: 62,
} as const
const EYEBROW_TEXT_STYLE = {
  color: "rgba(255,255,255,0.82)",
  fontSize: 15,
  fontWeight: "800",
  letterSpacing: 2.3,
  textTransform: "uppercase",
} as const
const HEADLINE_TEXT_STYLE = {
  ...TEXT_SHADOW,
  color: "#FFFFFF",
  fontSize: 48,
  fontWeight: "900",
  lineHeight: 49,
} as const
const BODY_TEXT_STYLE = {
  ...TEXT_SHADOW,
  color: "rgba(255,255,255,0.88)",
  fontSize: 21,
  fontWeight: "500",
  lineHeight: 32,
} as const
const META_TEXT_STYLE = {
  color: "rgba(255,255,255,0.72)",
  fontSize: 17,
  fontWeight: "700",
  lineHeight: 24,
} as const
const CTA_TEXT_STYLE = {
  color: "#FFFFFF",
  fontSize: 20,
  fontWeight: "900",
  lineHeight: 24,
} as const

function MaintenanceScreen({
  title,
  message,
  updatedAt,
  isRefreshing,
  onRetry,
}: MaintenanceScreenProps) {
  const headline = title.trim() || FALLBACK_TITLE
  const body = message.trim() || FALLBACK_MESSAGE
  const updatedLabel = updatedAt
    ? new Date(updatedAt).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })
    : "just now"

  return (
    <View className="flex-1 bg-black">
      <AuthLandingImageCarousel />
      <LinearGradient
        colors={[
          "rgba(0,0,0,0.2)",
          "rgba(0,0,0,0.08)",
          "rgba(0,0,0,0.68)",
          "#000000",
        ]}
        locations={[0, 0.35, 0.72, 1]}
        style={{ position: "absolute", inset: 0 }}
      />

      <SafeAreaView edges={["top", "bottom"]} className="flex-1">
        <View className="flex-1 justify-between px-6 pb-7 pt-14">
          <Animated.View entering={FadeIn.duration(700)}>
            <Text style={BRAND_TEXT_STYLE}>Wanderly</Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(650).delay(120)}
            className="gap-5"
          >
            <View className="self-start rounded-full border border-white/25 bg-black/25 px-4 py-2">
              <Text style={EYEBROW_TEXT_STYLE}>App unavailable</Text>
            </View>

            <View className="gap-3">
              <Text
                style={HEADLINE_TEXT_STYLE}
                adjustsFontSizeToFit
                minimumFontScale={0.82}
                numberOfLines={3}
                className="max-w-[350px]"
              >
                {headline}
              </Text>
              <Text style={BODY_TEXT_STYLE} className="max-w-[340px]">
                {body}
              </Text>
            </View>

            <Text style={META_TEXT_STYLE}>Last checked {updatedLabel}</Text>

            <Pressable
              onPress={onRetry}
              disabled={isRefreshing}
              className="h-[68px] flex-row items-center justify-center gap-3 rounded-full border border-white/20 bg-wl-accent active:scale-[0.97] active:opacity-90 disabled:opacity-70"
            >
              {isRefreshing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Icon as={RefreshCw} size={22} className="text-white" />
                  <Text style={CTA_TEXT_STYLE}>Check again</Text>
                </>
              )}
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  )
}

export { MaintenanceScreen }
export type { MaintenanceScreenProps }
