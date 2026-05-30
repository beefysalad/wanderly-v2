import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { Check, Wand2 } from "lucide-react-native"
import { useEffect } from "react"
import { View } from "react-native"
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated"
import { SafeAreaView } from "react-native-safe-area-context"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

import { AccentFill } from "../ui/accent-fill"
import { Photo } from "../ui/photo"

type Step = { t: string; done?: boolean; active?: boolean }

const STEPS: Step[] = [
  { t: "Reading the vibe", done: true },
  { t: "Finding spots in Siargao", done: true },
  { t: "Building day 3 of 5", active: true },
  { t: "Balancing your budget" },
]

/** 05 · The generation moment — animated aurora orb + live steps. */
export function AiGenerating() {
  const router = useRouter()
  const glow = useSharedValue(1)
  const float = useSharedValue(0)
  const orbit = useSharedValue(0)
  const spin = useSharedValue(0)

  useEffect(() => {
    glow.value = withRepeat(
      withTiming(1.12, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    )
    float.value = withRepeat(
      withTiming(-7, { duration: 1700, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    )
    orbit.value = withRepeat(
      withTiming(360, { duration: 14000, easing: Easing.linear }),
      -1
    )
    spin.value = withRepeat(
      withTiming(360, { duration: 800, easing: Easing.linear }),
      -1
    )
    const timer = setTimeout(() => router.replace("/trips/detail"), 3200)
    return () => clearTimeout(timer)
  }, [glow, float, orbit, spin, router])

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glow.value }],
    opacity: 0.55 + (glow.value - 1) * 2,
  }))
  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: float.value }],
  }))
  const orbitStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${orbit.value}deg` }],
  }))
  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value}deg` }],
  }))

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <Photo tone="night" className="absolute inset-0" />
      <LinearGradient
        colors={["rgba(11,12,16,0.1)", "rgba(11,12,16,0.95)"]}
        start={{ x: 0.5, y: 0.2 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: "absolute", inset: 0 }}
      />

      <View className="flex-1 items-center px-7 pt-24">
        <View className="h-[150px] w-[150px] items-center justify-center">
          <Animated.View
            style={glowStyle}
            className="absolute h-[150px] w-[150px] rounded-full"
          >
            <AccentFill style={{ flex: 1, borderRadius: 999 }} />
          </Animated.View>
          <Animated.View style={orbStyle}>
            <AccentFill
              style={{
                width: 124,
                height: 124,
                borderRadius: 999,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon as={Wand2} size={44} className="text-white" />
            </AccentFill>
          </Animated.View>
          <Animated.View
            style={orbitStyle}
            pointerEvents="none"
            className="absolute h-[178px] w-[178px] rounded-full border border-dashed border-white/35"
          />
        </View>

        <View className="mt-8 items-center">
          <Text className="text-[23px] font-extrabold tracking-tight text-white">
            Crafting your trip…
          </Text>
          <Text className="mt-1.5 max-w-[240px] text-center text-[14.5px] text-white/70">
            Mapping 5 days of surf, slow mornings and sunsets in Siargao.
          </Text>
        </View>

        <View className="mt-8 w-full gap-3">
          {STEPS.map((s) => (
            <View
              key={s.t}
              className="flex-row items-center gap-3"
              style={{ opacity: s.done || s.active ? 1 : 0.45 }}
            >
              <View
                className="h-[26px] w-[26px] items-center justify-center rounded-full"
                style={{
                  backgroundColor: s.done
                    ? undefined
                    : s.active
                      ? "rgba(255,255,255,0.14)"
                      : "rgba(255,255,255,0.07)",
                }}
              >
                {s.done ? (
                  <View className="h-[26px] w-[26px] items-center justify-center rounded-full bg-accent">
                    <Icon as={Check} size={15} className="text-white" />
                  </View>
                ) : s.active ? (
                  <Animated.View
                    style={spinStyle}
                    className="h-[13px] w-[13px] rounded-full border-2 border-white/30 border-t-white"
                  />
                ) : null}
              </View>
              <Text
                className="text-[15px] text-white"
                style={{ fontWeight: s.active ? "700" : "600" }}
              >
                {s.t}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  )
}
