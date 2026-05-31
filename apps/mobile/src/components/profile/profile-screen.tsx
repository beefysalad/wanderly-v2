import { useUser } from "@clerk/expo"
import { useRouter } from "expo-router"
import { Compass, LogOut, Settings, Users } from "lucide-react-native"
import { View } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"

import { ThemeToggle } from "@/components/settings/theme-toggle"
import { GlassCard } from "@/components/trips/ui/glass-card"
import { GradientAvatar } from "@/components/trips/ui/gradient-avatar"
import { ScreenGlow } from "@/components/trips/ui/screen-glow"
import { TripButton } from "@/components/trips/ui/trip-button"
import { Text } from "@/components/ui/text"
import { useSignOut } from "@/hooks/auth/use-sign-out"

import { ProfileLinkRow } from "./profile-link-row"

function ProfileScreen() {
  const router = useRouter()
  const { user } = useUser()
  const insets = useSafeAreaInsets()
  const { signOut, isSigningOut } = useSignOut()

  const displayName =
    user?.fullName ?? user?.firstName ?? user?.username ?? "You"
  const email = user?.primaryEmailAddress?.emailAddress ?? ""

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScreenGlow />
      <View
        className="flex-1 gap-5 px-5 pt-3.5"
        style={{ paddingBottom: insets.bottom + 96 }}
      >
        <View className="flex-row items-center gap-3.5">
          <GradientAvatar
            name={displayName}
            size={60}
            i={0}
            imageUrl={user?.hasImage ? user.imageUrl : undefined}
          />
          <View className="flex-1">
            <Text className="text-xl font-extrabold tracking-tight text-foreground">
              {displayName}
            </Text>
            {email !== "" && (
              <Text className="text-[13.5px] text-wl-text-2">{email}</Text>
            )}
          </View>
        </View>

        <View className="gap-2.5">
          <Text className="text-[12px] font-bold uppercase tracking-wider text-wl-text-3">
            Appearance
          </Text>
          <ThemeToggle />
        </View>

        <GlassCard className="p-0">
          <ProfileLinkRow
            icon={Compass}
            label="My solo trips"
            onPress={() => router.push("/trips/solo-home")}
          />
          <ProfileLinkRow
            icon={Users}
            label="Trip members"
            onPress={() => router.push("/trips/members")}
          />
          <ProfileLinkRow icon={Settings} label="Settings" last />
        </GlassCard>

        <View className="flex-1" />

        <View className="mb-4">
          <TripButton variant="ghost" icon={LogOut} full onPress={signOut}>
            {isSigningOut ? "Logging out…" : "Log out"}
          </TripButton>
        </View>
      </View>
    </SafeAreaView>
  )
}

export { ProfileScreen }
