import { useAuth } from "@clerk/expo"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "expo-router"
import {
  ChevronRight,
  Compass,
  LogOut,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react-native"
import { useState } from "react"
import { Alert, Pressable, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { ThemeToggle } from "@/components/settings/theme-toggle"
import { GlassCard } from "@/components/trips/ui/glass-card"
import { GradientAvatar } from "@/components/trips/ui/gradient-avatar"
import { ScreenGlow } from "@/components/trips/ui/screen-glow"
import { TripButton } from "@/components/trips/ui/trip-button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

function LinkRow({
  icon,
  label,
  onPress,
  last,
}: {
  icon: LucideIcon
  label: string
  onPress?: () => void
  last?: boolean
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 px-3.5 py-3.5"
      style={{
        borderBottomWidth: last ? 0 : 1,
        borderColor: "rgba(255,255,255,0.1)",
      }}
    >
      <View className="h-9 w-9 items-center justify-center rounded-xl bg-wl-accent-soft">
        <Icon as={icon} size={18} className="text-wl-accent" />
      </View>
      <Text className="flex-1 text-[15px] font-semibold text-foreground">
        {label}
      </Text>
      <Icon as={ChevronRight} size={18} className="text-wl-text-3" />
    </Pressable>
  )
}

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
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScreenGlow />
      <View className="flex-1 gap-5 px-5 pt-3.5">
        <View className="flex-row items-center gap-3.5">
          <GradientAvatar name="Maya Reyes" size={60} i={0} />
          <View className="flex-1">
            <Text className="text-xl font-extrabold tracking-tight text-foreground">
              Maya Reyes
            </Text>
            <Text className="text-[13.5px] text-wl-text-2">
              mandal.johnpatrickryan@gmail.com
            </Text>
          </View>
        </View>

        <View className="gap-2.5">
          <Text className="text-[12px] font-bold uppercase tracking-wider text-wl-text-3">
            Appearance
          </Text>
          <ThemeToggle />
        </View>

        <GlassCard className="p-0">
          <LinkRow
            icon={Compass}
            label="My solo trips"
            onPress={() => router.push("/trips/solo-home")}
          />
          <LinkRow
            icon={Users}
            label="Trip members"
            onPress={() => router.push("/trips/members")}
          />
          <LinkRow icon={Settings} label="Settings" last />
        </GlassCard>

        <View className="flex-1" />

        <View className="mb-4">
          <TripButton
            variant="ghost"
            icon={LogOut}
            full
            onPress={handleSignOut}
          >
            {isSigningOut ? "Logging out…" : "Log out"}
          </TripButton>
        </View>
      </View>
    </SafeAreaView>
  )
}
