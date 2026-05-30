import { useRouter } from "expo-router"
import {
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Plane,
  Plus,
  ScanLine,
  Users,
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
import { TripButton } from "../ui/trip-button"

const CREW = ["Jan Cruz", "Bea Lim", "Kiko Tan", "Rey Go"]

/** 08 · Trips home — group + solo coexisting. Primary Trips tab. */
export function TripsHomeGroup() {
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
              <View className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-background bg-wl-accent-2" />
            </View>
            <Pressable onPress={() => router.push("/(tabs)/profile")}>
              <GradientAvatar name="Maya Reyes" size={42} i={0} />
            </Pressable>
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
          <Pressable onPress={() => router.push("/trips/group-detail")}>
            <GlassCard className="overflow-hidden rounded-[26px] p-0">
              <Photo tone="island" className="h-[184px]">
                <View className="absolute inset-x-3.5 top-3.5 flex-row items-start justify-between">
                  <HeroPill icon={Users}>Group · 6</HeroPill>
                  <HeroPill tone="aurora">in 28 days</HeroPill>
                </View>
                <View className="absolute inset-x-4 bottom-3 flex-row items-end justify-between">
                  <View>
                    <View className="flex-row items-center gap-1.5">
                      <Icon as={MapPin} size={14} className="text-white" />
                      <Text className="text-[13px] font-semibold text-white opacity-90">
                        El Nido, Palawan
                      </Text>
                    </View>
                    <Text className="mt-1 text-2xl font-extrabold tracking-tight text-white">
                      Palawan Barkada
                    </Text>
                  </View>
                  <View className="flex-row">
                    {CREW.map((n, i) => (
                      <View key={n} style={{ marginLeft: i ? -12 : 0 }}>
                        <GradientAvatar name={n} size={32} i={i + 1} ring />
                      </View>
                    ))}
                    <View
                      style={{ marginLeft: -12, backgroundColor: "rgba(10,10,15,0.6)" }}
                      className="h-8 w-8 items-center justify-center rounded-full border-2 border-background"
                    >
                      <Text className="text-[11px] font-bold text-white">
                        +2
                      </Text>
                    </View>
                  </View>
                </View>
              </Photo>
              <View className="flex-row items-center justify-between px-4 py-3">
                <View className="flex-row items-center gap-1.5">
                  <Icon as={Calendar} size={15} className="text-wl-text-2" />
                  <Text className="text-[13.5px] font-semibold text-wl-text-2">
                    28 Jun–3 Jul
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <View className="h-1.5 w-1.5 rounded-full bg-wl-accent-2" />
                  <Text className="text-[13px] font-bold text-wl-accent-2">
                    Bea is editing
                  </Text>
                </View>
              </View>
            </GlassCard>
          </Pressable>

          <Pressable onPress={() => router.push("/trips/detail")}>
            <GlassCard className="mt-3 flex-row items-center gap-3 rounded-[20px] p-2.5">
              <Photo tone="ocean" className="h-[66px] w-[66px] rounded-[15px]" />
              <View className="min-w-0 flex-1">
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-[15.5px] font-bold text-foreground">
                    Surf & Slow Mornings
                  </Text>
                  <Text className="overflow-hidden rounded-full bg-wl-accent-soft px-1.5 py-0.5 text-[10.5px] font-bold text-wl-accent">
                    SOLO
                  </Text>
                </View>
                <View className="mt-1 flex-row items-center gap-1.5">
                  <Icon as={MapPin} size={13} className="text-wl-text-2" />
                  <Text className="text-[12.5px] text-wl-text-2">
                    Siargao · in 12 days
                  </Text>
                </View>
              </View>
              <Icon as={ChevronRight} size={18} className="text-wl-text-3" />
            </GlassCard>
          </Pressable>

          <View className="mt-3.5 flex-row gap-2.5">
            <TripButton
              variant="soft"
              icon={Plus}
              full
              onPress={() => router.push("/trips/ai")}
              style={{ flex: 1 }}
            >
              New trip
            </TripButton>
            <TripButton
              variant="glass"
              icon={ScanLine}
              full
              onPress={() => router.push("/trips/members")}
              style={{ flex: 1 }}
            >
              Join code
            </TripButton>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
