import { Heart, type LucideIcon, MapPin } from "lucide-react-native"
import { View } from "react-native"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

import { GradientAvatar } from "./gradient-avatar"

type ItineraryItemProps = {
  time: string
  title: string
  place?: string
  icon: LucideIcon
  last?: boolean
  /** Group mode: attribution + vote count. */
  by?: string
  byIndex?: number
  votes?: number
}

/** One timeline entry on a day's itinerary. Group mode adds author + votes. */
function ItineraryItem({
  time,
  title,
  place,
  icon,
  last,
  by,
  byIndex = 0,
  votes,
}: ItineraryItemProps) {
  return (
    <View className="flex-row gap-3">
      <View className="items-center">
        <View className="h-[38px] w-[38px] items-center justify-center rounded-xl border border-wl-border bg-wl-surface-2">
          <Icon as={icon} size={18} className="text-accent" />
        </View>
        {!last && <View className="my-1 w-0.5 flex-1 bg-wl-border-2" />}
      </View>
      <View className="flex-1" style={{ paddingBottom: last ? 0 : 16 }}>
        <Text className="text-[12px] font-bold tracking-wide text-accent">
          {time}
        </Text>
        <Text className="mt-0.5 text-[15.5px] font-bold text-foreground">
          {title}
        </Text>
        {place && (
          <View className="mt-0.5 flex-row items-center gap-1.5">
            <Icon as={MapPin} size={12} className="text-wl-text-2" />
            <Text className="text-[12.5px] text-wl-text-2">{place}</Text>
          </View>
        )}
        {by && (
          <View className="mt-2 flex-row items-center gap-2.5">
            <View className="flex-row items-center gap-1.5">
              <GradientAvatar name={by} size={20} i={byIndex} />
              <Text className="text-[11.5px] font-semibold text-wl-text-3">
                {by.split(" ")[0]}
              </Text>
            </View>
            <View className="h-6 flex-row items-center gap-1 rounded-full border border-wl-border bg-wl-surface-2 px-2.5">
              <Icon
                as={Heart}
                size={12}
                className="text-wl-accent-2"
                fill="currentColor"
              />
              <Text className="text-[11.5px] font-bold text-wl-text-2">
                {votes}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  )
}

export { ItineraryItem }
