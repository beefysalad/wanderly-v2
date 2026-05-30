import { useRouter } from "expo-router"
import {
  ArrowLeft,
  MapPin,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Share2,
  User,
  Utensils,
  Waves,
} from "lucide-react-native"
import { Pressable, ScrollView, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

import { Aurora } from "../ui/aurora"
import { DayPill } from "../ui/day-pill"
import { ItineraryItem } from "../ui/itinerary-item"
import { OverlayIconButton } from "../ui/overlay-icon-button"
import { Photo } from "../ui/photo"

const DAYS = [
  ["Thu", "1"],
  ["Fri", "2"],
  ["Sat", "3"],
  ["Sun", "4"],
  ["Mon", "5"],
]

/** 06 · Trip detail / itinerary — solo. */
export function TripDetailSolo() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  return (
    <View className="flex-1 bg-background">
      <Photo
        tone="ocean"
        className="absolute inset-x-0 top-0 h-[220px]"
      />
      <View
        style={{ top: insets.top + 6 }}
        className="absolute inset-x-[18px] z-10 flex-row items-center justify-between"
      >
        <OverlayIconButton icon={ArrowLeft} onPress={() => router.back()} />
        <View className="flex-row gap-2.5">
          <OverlayIconButton icon={Share2} />
          <OverlayIconButton icon={MoreHorizontal} />
        </View>
      </View>

      <View style={{ paddingTop: 178 }} className="flex-1">
        <View className="flex-1 rounded-t-[28px] bg-background px-5 pt-5">
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <View className="flex-row items-center gap-1.5">
                <Icon as={MapPin} size={13} className="text-wl-text-2" />
                <Text className="text-[12.5px] font-semibold text-wl-text-2">
                  Siargao · 12–16 Jun
                </Text>
              </View>
              <Text className="mt-0.5 text-[23px] font-extrabold tracking-tight text-foreground">
                Surf & Slow Mornings
              </Text>
            </View>
            <View className="h-[30px] flex-row items-center gap-1.5 rounded-full bg-wl-accent-soft px-2.5">
              <Icon as={User} size={13} className="text-wl-accent" />
              <Text className="text-[12.5px] font-bold text-wl-accent">
                Solo
              </Text>
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
                active={i === 1}
              />
            ))}
          </ScrollView>

          <View className="mb-3.5 mt-4 flex-row items-center justify-between">
            <Text className="text-base font-bold text-foreground">
              Day 2 · Island hopping
            </Text>
            <View className="flex-row items-center gap-1.5">
              <Icon as={RefreshCw} size={13} className="text-accent" />
              <Text className="text-[12.5px] font-bold text-accent">
                Regenerate
              </Text>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerClassName="pb-28"
          >
            <ItineraryItem
              time="08:00"
              title="Naked, Daku & Guyam islands"
              place="Boat from General Luna pier"
              icon={Waves}
            />
            <ItineraryItem
              time="13:00"
              title="Grilled lunch on Daku Island"
              place="Beachfront bangka stalls"
              icon={Utensils}
            />
            <ItineraryItem
              time="16:00"
              title="Maasin River rope swing"
              place="Maasin, San Isidro"
              icon={MapPin}
            />
            <ItineraryItem
              time="19:30"
              title="Dinner & live set"
              place="Kermit Siargao"
              icon={Utensils}
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
