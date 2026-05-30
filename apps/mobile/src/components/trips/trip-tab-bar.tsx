import { useRouter } from "expo-router"
import type { BottomTabBarProps } from "expo-router/js-tabs"
import {
  Compass,
  Map,
  User,
  Wallet,
  Wand2,
  type LucideIcon,
} from "lucide-react-native"
import { Pressable, useColorScheme, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { cn } from "@/lib/utils"

import { AccentFill } from "./ui/accent-fill"

const TAB_META: Record<string, { icon: LucideIcon; label: string }> = {
  index: { icon: Compass, label: "Trips" },
  log: { icon: Map, label: "Log" },
  budget: { icon: Wallet, label: "Budget" },
  profile: { icon: User, label: "Profile" },
}

/**
 * The signature 5-slot bar: Trips · Log · [aurora Create] · Budget · Profile.
 * The center button is not a tab — it launches the AI itinerary flow.
 */
function TripTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const scheme = useColorScheme()
  const left = state.routes.slice(0, 2)
  const right = state.routes.slice(2)

  const renderTab = (
    route: BottomTabBarProps["state"]["routes"][number],
    routeIndex: number
  ) => {
    const meta = TAB_META[route.name]
    if (!meta) return null
    const focused = state.index === routeIndex
    return (
      <Pressable
        key={route.key}
        className="w-14 items-center gap-1.5"
        onPress={() => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          })
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }}
      >
        <Icon
          as={meta.icon}
          size={23}
          className={focused ? "text-accent" : "text-wl-text-3"}
        />
        <Text
          className={cn(
            "text-[10.5px]",
            focused ? "font-bold text-accent" : "font-medium text-wl-text-3"
          )}
        >
          {meta.label}
        </Text>
      </Pressable>
    )
  }

  const barBg =
    scheme === "dark" ? "rgba(18,20,28,0.82)" : "rgba(255,255,255,0.82)"

  return (
    <View
      pointerEvents="box-none"
      style={{ paddingBottom: insets.bottom > 0 ? insets.bottom : 14 }}
      className="absolute inset-x-0 bottom-0"
    >
      <View
        style={{
          backgroundColor: barBg,
          shadowColor: "#000",
          shadowOpacity: 0.35,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 12 },
          elevation: 16,
        }}
        className="mx-4 flex-row items-center justify-around rounded-[30px] border border-wl-border-2 px-2 py-2.5"
      >
        {left.map((route) => renderTab(route, state.routes.indexOf(route)))}

        <View className="w-[60px] items-center">
          <Pressable
            onPress={() => router.push("/trips/ai")}
            style={{
              marginTop: -30,
              shadowColor: "#FF6B5B",
              shadowOpacity: 0.55,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 8 },
              elevation: 8,
            }}
          >
            <AccentFill
              style={{
                width: 56,
                height: 56,
                borderRadius: 19,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.25)",
              }}
            >
              <Icon as={Wand2} size={24} className="text-white" />
            </AccentFill>
          </Pressable>
        </View>

        {right.map((route) => renderTab(route, state.routes.indexOf(route)))}
      </View>
    </View>
  )
}

export { TripTabBar }
