import {
  Calendar,
  Clock,
  Image as ImageIcon,
  MapPin,
  Search,
} from "lucide-react-native"
import { ScrollView, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

import { GlassCard } from "../ui/glass-card"
import { Photo } from "../ui/photo"
import { ScreenGlow } from "../ui/screen-glow"

const STATS: [string, string][] = [
  ["4", "trips"],
  ["23", "days away"],
  ["38", "places"],
]

const TRIPS = [
  {
    t: "El Nido Island Life",
    l: "Palawan",
    tone: "island" as const,
    d: "Mar 2025",
    days: 6,
    photos: 142,
  },
  {
    t: "Sagada Highlands",
    l: "Mountain Province",
    tone: "jungle" as const,
    d: "Jan 2025",
    days: 4,
    photos: 89,
  },
]

/** 07 · Travel log / memories. */
export function TravelLog() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScreenGlow />
      <View className="flex-1 px-5">
        <View className="flex-row items-center justify-between pt-3.5">
          <Text className="text-2xl font-extrabold tracking-tight text-foreground">
            Travel log
          </Text>
          <View className="h-[42px] w-[42px] items-center justify-center rounded-[13px] border border-wl-border bg-wl-surface-2">
            <Icon as={Search} size={20} className="text-foreground" />
          </View>
        </View>

        <ScrollView
          className="-mx-5 mt-3.5 flex-1"
          contentContainerClassName="px-5 pb-32"
          showsVerticalScrollIndicator={false}
        >
          <GlassCard className="overflow-hidden rounded-3xl p-0">
            <Photo tone="sunset" className="p-[18px] pb-4">
              <Text className="text-[12.5px] font-bold tracking-wide text-white opacity-90">
                2025 IN TRAVEL
              </Text>
              <View className="mt-3 flex-row gap-6">
                {STATS.map(([n, label]) => (
                  <View key={label}>
                    <Text className="text-[30px] font-extrabold leading-none tracking-tighter text-white">
                      {n}
                    </Text>
                    <Text className="mt-1 text-xs text-white opacity-85">
                      {label}
                    </Text>
                  </View>
                ))}
              </View>
            </Photo>
          </GlassCard>

          <View className="mb-3 mt-4 flex-row items-center justify-between">
            <Text className="text-base font-bold text-foreground">
              Completed trips
            </Text>
            <Text className="text-[13px] font-semibold text-wl-text-2">4</Text>
          </View>

          <View className="gap-3">
            {TRIPS.map((x) => (
              <GlassCard
                key={x.t}
                className="flex-row items-center gap-3 rounded-[20px] p-2.5"
              >
                <Photo tone={x.tone} className="h-20 w-20 rounded-2xl">
                  <View
                    style={{ backgroundColor: "rgba(10,10,15,0.5)" }}
                    className="absolute bottom-1.5 right-1.5 h-[22px] flex-row items-center gap-1 rounded-full px-2"
                  >
                    <Icon as={ImageIcon} size={11} className="text-white" />
                    <Text className="text-[11px] font-bold text-white">
                      {x.photos}
                    </Text>
                  </View>
                </Photo>
                <View className="min-w-0 flex-1">
                  <Text className="text-[15.5px] font-bold text-foreground">
                    {x.t}
                  </Text>
                  <View className="mt-1 flex-row items-center gap-1.5">
                    <Icon as={MapPin} size={12} className="text-wl-text-2" />
                    <Text className="text-[12.5px] text-wl-text-2">{x.l}</Text>
                  </View>
                  <View className="mt-1.5 flex-row gap-3">
                    <View className="flex-row items-center gap-1">
                      <Icon
                        as={Calendar}
                        size={12}
                        className="text-wl-text-3"
                      />
                      <Text className="text-[11.5px] font-semibold text-wl-text-3">
                        {x.d}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Icon as={Clock} size={12} className="text-wl-text-3" />
                      <Text className="text-[11.5px] font-semibold text-wl-text-3">
                        {x.days} days
                      </Text>
                    </View>
                  </View>
                </View>
              </GlassCard>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
