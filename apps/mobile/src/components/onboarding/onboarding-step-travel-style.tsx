import { Backpack, Check, Gem, Luggage, type LucideIcon } from "lucide-react-native"
import { useState } from "react"
import { Pressable, View } from "react-native"

import { TripButton } from "@/components/trips/ui/trip-button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

type TravelStyle = "BUDGET" | "MID_RANGE" | "LUXURY"

const OPTIONS: {
  value: TravelStyle
  icon: LucideIcon
  label: string
  description: string
}[] = [
  {
    value: "BUDGET",
    icon: Backpack,
    label: "Budget explorer",
    description: "Hostels, street food, habal-habal rides.",
  },
  {
    value: "MID_RANGE",
    icon: Luggage,
    label: "Comfortable traveller",
    description: "Hotels, sit-down meals, Grab rides.",
  },
  {
    value: "LUXURY",
    icon: Gem,
    label: "Luxury wanderer",
    description: "Resorts, fine dining, private transfers.",
  },
]

type Props = {
  onNext: (style: TravelStyle) => void
}

export function OnboardingStepTravelStyle({ onNext }: Props) {
  const [selected, setSelected] = useState<TravelStyle | null>(null)

  return (
    <View className="flex-1 gap-7">
      <View className="gap-2">
        <Text className="text-[27px] font-extrabold leading-tight tracking-tight text-foreground">
          How do you{"\n"}travel?
        </Text>
        <Text className="text-[14.5px] leading-relaxed text-wl-text-2">
          This shapes your AI itineraries and budget estimates — you can change
          it any time.
        </Text>
      </View>

      <View className="gap-3">
        {OPTIONS.map((option) => {
          const isSelected = selected === option.value
          return (
            <Pressable
              key={option.value}
              onPress={() => setSelected(option.value)}
              className={
                isSelected
                  ? "flex-row items-center gap-3.5 rounded-[22px] border border-wl-accent-line bg-wl-accent-soft p-4"
                  : "flex-row items-center gap-3.5 rounded-[22px] border border-wl-border bg-wl-surface p-4"
              }
            >
              <View
                className={
                  isSelected
                    ? "h-[52px] w-[52px] items-center justify-center rounded-2xl bg-accent"
                    : "h-[52px] w-[52px] items-center justify-center rounded-2xl bg-wl-surface-2"
                }
              >
                <Icon
                  as={option.icon}
                  size={26}
                  className={isSelected ? "text-accent-foreground" : "text-wl-text-2"}
                />
              </View>
              <View className="flex-1">
                <Text className="text-[17px] font-bold text-foreground">
                  {option.label}
                </Text>
                <Text className="mt-0.5 text-[13px] leading-snug text-wl-text-2">
                  {option.description}
                </Text>
              </View>
              <View
                className={
                  isSelected
                    ? "h-6 w-6 items-center justify-center rounded-full border-2 border-accent bg-accent"
                    : "h-6 w-6 items-center justify-center rounded-full border-2 border-wl-border-3"
                }
              >
                {isSelected && (
                  <Icon
                    as={Check}
                    size={14}
                    className="text-accent-foreground"
                  />
                )}
              </View>
            </Pressable>
          )
        })}
      </View>

      <View className="flex-1" />

      <TripButton
        variant="primary"
        size="lg"
        full
        onPress={() => selected && onNext(selected)}
      >
        Continue
      </TripButton>
    </View>
  )
}
