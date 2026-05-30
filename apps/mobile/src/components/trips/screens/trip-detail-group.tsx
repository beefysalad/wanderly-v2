import { useRouter } from "expo-router"
import {
  ArrowLeft,
  MapPin,
  Plus,
  Users,
  Utensils,
  Waves,
} from "lucide-react-native"
import { Pressable, ScrollView, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

import { Aurora } from "../ui/aurora"
import { DayPill } from "../ui/day-pill"
import { GradientAvatar } from "../ui/gradient-avatar"
import { ItineraryItem } from "../ui/itinerary-item"
import { OverlayIconButton } from "../ui/overlay-icon-button"
import { Photo } from "../ui/photo"

const DAYS = [
  ["Thu", "28"],
  ["Fri", "29"],
  ["Sat", "30"],
  ["Sun", "1"],
  ["Mon", "2"],
]
const HEADER_CREW = ["Jan Cruz", "Bea Lim", "Kiko Tan"]

/** 09 · Trip detail — collaborative itinerary with votes + live editing. */
export function TripDetailGroup() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  return (
    <View className="flex-1 bg-background">
      <Photo tone="island" className="absolute inset-x-0 top-0 h-[210px]" />
      <View
        style={{ top: insets.top + 6 }}
        className="absolute inset-x-[18px] z-10 flex-row items-center justify-between"
      >
        <OverlayIconButton icon={ArrowLeft} onPress={() => router.back()} />
        <Pressable
          className="flex-row"
          onPress={() => router.push("/trips/members")}
        >
          {HEADER_CREW.map((n, i) => (
            <View key={n} style={{ marginLeft: i ? -11 : 0 }}>
              <GradientAvatar name={n} size={32} i={i + 1} ring />
            </View>
          ))}
          <View
            style={{ marginLeft: -11, backgroundColor: "rgba(10,10,15,0.55)" }}
            className="h-8 w-8 items-center justify-center rounded-full border-2 border-white/20"
          >
            <Text className="text-[11px] font-bold text-white">+3</Text>
          </View>
        </Pressable>
      </View>

      <View style={{ paddingTop: 168 }} className="flex-1">
        <View className="flex-1 rounded-t-[28px] bg-background px-5 pt-5">
          <View className="flex-row items-start justify-between">
            <View>
              <View className="flex-row items-center gap-1.5">
                <Icon as={MapPin} size={13} className="text-wl-text-2" />
                <Text className="text-[12.5px] font-semibold text-wl-text-2">
                  El Nido · 28 Jun–3 Jul
                </Text>
              </View>
              <Text className="mt-0.5 text-[23px] font-extrabold tracking-tight text-foreground">
                Palawan Barkada
              </Text>
            </View>
            <View className="h-[30px] flex-row items-center gap-1.5 rounded-full bg-wl-accent-soft px-2.5">
              <Icon as={Users} size={13} className="text-wl-accent" />
              <Text className="text-[12.5px] font-bold text-wl-accent">6</Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-5 mt-4"
            contentContainerClassName="gap-2 px-5"
          >
            {DAYS.map(([weekday, num], i) => (
              <DayPill
                key={num}
                weekday={weekday}
                label={num}
                active={i === 2}
              />
            ))}
          </ScrollView>

          <View className="mb-3.5 mt-4 flex-row items-center justify-between">
            <Text className="text-base font-bold text-foreground">
              Day 3 · Big Lagoon
            </Text>
            <View className="flex-row items-center gap-1.5">
              <View className="h-1.5 w-1.5 rounded-full bg-wl-accent-2" />
              <Text className="text-[12px] font-bold text-wl-accent-2">
                Bea editing
              </Text>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerClassName="pb-28"
          >
            <ItineraryItem
              time="07:30"
              title="Island hopping Tour A"
              place="Big & Small Lagoon"
              icon={Waves}
              by="Jan Cruz"
              byIndex={1}
              votes={5}
            />
            <ItineraryItem
              time="12:30"
              title="Beach picnic lunch"
              place="Shimizu Island"
              icon={Utensils}
              by="Bea Lim"
              byIndex={2}
              votes={4}
            />
            <ItineraryItem
              time="18:00"
              title="Sunset at Las Cabanas"
              place="Bar raft + drinks"
              icon={Waves}
              by="Kiko Tan"
              byIndex={3}
              votes={6}
              last
            />
          </ScrollView>
        </View>
      </View>

      <Pressable
        style={{
          bottom: insets.bottom + 24,
          shadowColor: "#7C6BFF",
          shadowOpacity: 0.5,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 10 },
          elevation: 8,
        }}
        className="absolute right-5 z-20"
      >
        <Aurora
          style={{
            width: 56,
            height: 56,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.25)",
          }}
        >
          <Icon as={Plus} size={26} className="text-white" />
        </Aurora>
      </Pressable>
    </View>
  )
}
