import { useRouter } from "expo-router"
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Plane,
  Plus,
  ScanLine,
  User,
  type LucideIcon,
} from "lucide-react-native"
import { Pressable, ScrollView, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

import { Chip } from "../ui/chip"
import { GlassCard } from "../ui/glass-card"
import { GradientAvatar } from "../ui/gradient-avatar"
import { HeroPill } from "../ui/hero-pill"
import { Photo } from "../ui/photo"
import { ScreenGlow } from "../ui/screen-glow"

const SECONDARY = [
  {
    t: "Coron Island Escape",
    l: "Palawan",
    tone: "island" as const,
    d: "Aug · planning",
  },
  {
    t: "Batangas Dive Weekend",
    l: "Anilao",
    tone: "jungle" as const,
    d: "Sep · draft",
  },
]

function CreateTile({
  icon,
  label,
  onPress,
}: {
  icon: LucideIcon
  label: string
  onPress?: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 gap-2 rounded-[18px] border border-dashed border-wl-border-2 bg-wl-surface p-3.5"
    >
      <Icon as={icon} size={20} className="text-accent" />
      <Text className="text-[13.5px] font-bold text-foreground">{label}</Text>
    </Pressable>
  )
}

/** 03 · Trips home — solo lead experience. */
export function TripsHomeSolo() {
  const router = useRouter()

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScreenGlow />
      <View className="flex-1 px-5">
        <View className="flex-row items-center justify-between pt-3.5">
          <View>
            <Text className="text-[13.5px] font-medium text-wl-text-2">
              Sunday, 31 May
            </Text>
            <Text className="mt-px text-2xl font-extrabold tracking-tight text-foreground">
              Hey, Maya 👋
            </Text>
          </View>
          <View className="flex-row gap-2.5">
            <View className="h-[42px] w-[42px] items-center justify-center rounded-[13px] border border-wl-border bg-wl-surface-2">
              <Icon as={Bell} size={20} className="text-foreground" />
            </View>
            <GradientAvatar name="Maya Reyes" size={42} i={0} />
          </View>
        </View>

        <View className="mb-1 mt-4 flex-row gap-2">
          <Chip active icon={Plane}>
            Planning
          </Chip>
          <Chip icon={CheckCircle2}>Completed</Chip>
          <Chip>Cancelled</Chip>
        </View>

        <ScrollView
          className="-mx-5 mt-2.5 flex-1"
          contentContainerClassName="px-5 pb-32"
          showsVerticalScrollIndicator={false}
        >
          <Pressable onPress={() => router.push("/trips/detail")}>
            <GlassCard className="overflow-hidden rounded-[26px] p-0">
              <Photo tone="ocean" className="h-[188px]">
                <View className="absolute inset-x-3.5 top-3.5 flex-row items-start justify-between">
                  <HeroPill icon={User}>Solo</HeroPill>
                  <HeroPill tone="aurora">in 12 days</HeroPill>
                </View>
                <View className="absolute inset-x-4 bottom-3.5">
                  <View className="flex-row items-center gap-1.5">
                    <Icon as={MapPin} size={14} className="text-white" />
                    <Text className="text-[13px] font-semibold text-white opacity-90">
                      Siargao, Philippines
                    </Text>
                  </View>
                  <Text className="mt-1 text-[25px] font-extrabold tracking-tight text-white">
                    Surf & Slow Mornings
                  </Text>
                </View>
              </Photo>
              <View className="flex-row items-center justify-between px-4 py-3">
                <View className="flex-row items-center gap-1.5">
                  <Icon as={MapPin} size={15} className="text-wl-text-2" />
                  <Text className="text-[13.5px] font-semibold text-wl-text-2">
                    12–16 Jun · 5 days
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-[13.5px] font-bold text-accent">
                    Open trip
                  </Text>
                  <Icon as={ArrowRight} size={15} className="text-accent" />
                </View>
              </View>
            </GlassCard>
          </Pressable>

          <View className="mt-3 gap-3">
            {SECONDARY.map((x) => (
              <Pressable key={x.t} onPress={() => router.push("/trips/detail")}>
                <GlassCard className="flex-row items-center gap-3 rounded-[20px] p-2.5">
                  <Photo
                    tone={x.tone}
                    className="h-[66px] w-[66px] rounded-[15px]"
                  />
                  <View className="min-w-0 flex-1">
                    <Text className="text-[15.5px] font-bold text-foreground">
                      {x.t}
                    </Text>
                    <View className="mt-1 flex-row items-center gap-1.5">
                      <Icon as={MapPin} size={13} className="text-wl-text-2" />
                      <Text className="text-[12.5px] text-wl-text-2">
                        {x.l} · {x.d}
                      </Text>
                    </View>
                  </View>
                  <Icon as={ChevronRight} size={18} className="text-wl-text-3" />
                </GlassCard>
              </Pressable>
            ))}
          </View>

          <View className="mt-3.5 flex-row gap-2.5">
            <CreateTile
              icon={Plus}
              label="New trip"
              onPress={() => router.push("/trips/ai")}
            />
            <CreateTile
              icon={ScanLine}
              label="Join by code"
              onPress={() => router.push("/trips/members")}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
