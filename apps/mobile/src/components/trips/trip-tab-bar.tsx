import type { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs"
import { BlurView } from "expo-blur"
import { useRouter } from "expo-router"
import {
  Compass,
  type LucideIcon,
  Map,
  User,
  Wallet,
  Wand2,
} from "lucide-react-native"
import { useColorScheme } from "nativewind"
import { useEffect, useState } from "react"
import { Pressable, View, type LayoutChangeEvent } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Icon } from "@/components/ui/icon"
import { useTheme } from "@/hooks/use-theme"

type TabMeta = { label: string; icon: LucideIcon }

/** Tab label + icon by route name (order follows the navigator). */
const TAB_META: Record<string, TabMeta> = {
  index: { label: "Trips", icon: Compass },
  log: { label: "Log", icon: Map },
  budget: { label: "Budget", icon: Wallet },
  profile: { label: "You", icon: User },
}

const PILL_PADDING = 6

/**
 * Floating "Liquid Glass" tab bar — a blurred translucent pill with a sliding
 * accent capsule under the active tab, plus a detached glass wand "Create"
 * button (no raised center dome). Deep Ocean: solid fills + blur, no gradients.
 */
function TripTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const colors = useTheme()
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme !== "light"

  const tabs = state.routes.filter((r) => r.name in TAB_META)
  const activeIndex = Math.max(
    0,
    tabs.findIndex((r) => r.key === state.routes[state.index]?.key)
  )

  const [pillWidth, setPillWidth] = useState(0)
  const capsuleWidth = pillWidth
    ? (pillWidth - PILL_PADDING * 2) / tabs.length
    : 0

  const tx = useSharedValue(0)
  useEffect(() => {
    tx.value = withTiming(activeIndex * capsuleWidth, { duration: 380 })
  }, [tx, activeIndex, capsuleWidth])
  const capsuleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }],
  }))

  const blurTint = isDark ? "dark" : "light"
  const glassOverlay = isDark
    ? "rgba(15,21,30,0.55)"
    : "rgba(255,255,255,0.55)"
  // neutral gray blob behind the active icon (Apple Music style)
  const activeHighlight = isDark
    ? "rgba(255,255,255,0.14)"
    : "rgba(9,24,34,0.08)"

  function onPillLayout(e: LayoutChangeEvent) {
    setPillWidth(e.nativeEvent.layout.width)
  }

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: insets.bottom > 0 ? insets.bottom : 22,
        height: 58,
        flexDirection: "row",
        alignItems: "stretch",
        columnGap: 11,
      }}
    >
      {/* liquid-glass tab pill */}
      <View
        onLayout={onPillLayout}
        className="flex-1 overflow-hidden rounded-full border border-wl-border-2"
        style={{ padding: PILL_PADDING, ...SHADOW }}
      >
        <BlurView
          tint={blurTint}
          intensity={48}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: glassOverlay,
          }}
        />

        {/* sliding accent capsule under the active tab */}
        {capsuleWidth > 0 && (
          <Animated.View
            pointerEvents="none"
            className="rounded-full"
            style={[
              {
                position: "absolute",
                top: PILL_PADDING,
                bottom: PILL_PADDING,
                left: PILL_PADDING,
                width: capsuleWidth,
                backgroundColor: activeHighlight,
              },
              capsuleStyle,
            ]}
          />
        )}

        <View className="flex-1 flex-row">
          {tabs.map((route, i) => {
            const meta = TAB_META[route.name]
            const focused = i === activeIndex

            function onPress() {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              })
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name)
              }
            }

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                accessibilityLabel={meta.label}
                className="flex-1 items-center justify-center"
              >
                <Icon
                  as={meta.icon}
                  size={23}
                  strokeWidth={focused ? 2.3 : 1.9}
                  color={focused ? colors.accent : colors.textSecondary}
                />
              </Pressable>
            )
          })}
        </View>
      </View>

      {/* detached glass Create accessory */}
      <Pressable
        onPress={() => router.push("/trips/ai")}
        accessibilityRole="button"
        accessibilityLabel="Create with AI"
        className="overflow-hidden rounded-full border border-wl-border-2"
        style={{ width: 58, alignItems: "center", justifyContent: "center", ...SHADOW }}
      >
        <BlurView
          tint={blurTint}
          intensity={48}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: glassOverlay,
          }}
        />
        <Icon as={Wand2} size={24} strokeWidth={2.1} color={colors.accent} />
      </Pressable>
    </View>
  )
}

const SHADOW = {
  shadowColor: "#000",
  shadowOpacity: 0.3,
  shadowRadius: 24,
  shadowOffset: { width: 0, height: 14 },
  elevation: 12,
}

export { TripTabBar }
