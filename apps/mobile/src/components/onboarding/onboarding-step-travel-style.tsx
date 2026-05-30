import { Backpack, Check, Gem, Luggage } from "lucide-react-native"
import { TouchableOpacity, View } from "react-native"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

type TravelStyle = "BUDGET" | "MID_RANGE" | "LUXURY"

const OPTIONS: {
  value: TravelStyle
  icon: typeof Backpack
  label: string
  tagline: string
  description: string
  iconClass: string
  toneClass: string
}[] = [
  {
    value: "BUDGET",
    icon: Backpack,
    label: "Budget Explorer",
    tagline: "Make every peso count",
    description: "Hostels, street food, habal-habal rides",
    iconClass: "text-orange-300",
    toneClass: "text-orange-300 bg-orange-500/10 border-orange-500/20",
  },
  {
    value: "MID_RANGE",
    icon: Luggage,
    label: "Comfortable Traveller",
    tagline: "Best of both worlds",
    description: "Hotels, sit-down meals, Grab rides",
    iconClass: "text-blue-300",
    toneClass: "text-blue-300 bg-blue-500/10 border-blue-500/20",
  },
  {
    value: "LUXURY",
    icon: Gem,
    label: "Luxury Wanderer",
    tagline: "No compromises",
    description: "Resorts, fine dining, private transfers",
    iconClass: "text-purple-300",
    toneClass: "text-purple-300 bg-purple-500/10 border-purple-500/20",
  },
]

type Props = {
  onNext: (style: TravelStyle) => void
}

export function OnboardingStepTravelStyle({ onNext }: Props) {
  const [selected, setSelected] = useState<TravelStyle | null>(null)

  return (
    <View className="gap-8">
      <View className="gap-2">
        <Text className="text-3xl font-bold text-white">
          How do you travel?
        </Text>
        <Text className="text-base leading-relaxed text-slate-400">
          This shapes your AI itineraries and budget estimates.
        </Text>
      </View>

      <View className="gap-4">
        {OPTIONS.map((option) => {
          const isSelected = selected === option.value

          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => setSelected(option.value)}
              activeOpacity={0.9}
              className={[
                "rounded-2xl border p-4",
                isSelected
                  ? "border-amber-400/50 bg-slate-800/80"
                  : "border-white/10 bg-white/5",
              ].join(" ")}
              style={{
                shadowColor: isSelected ? "#f59e0b" : "#000",
                shadowOffset: { width: 0, height: isSelected ? 8 : 2 },
                shadowOpacity: isSelected ? 0.22 : 0.06,
                shadowRadius: isSelected ? 16 : 4,
                elevation: isSelected ? 8 : 2,
              }}
            >
              <View className="flex-row items-start justify-between gap-4">
                <View className="flex-1 flex-row items-start gap-3">
                  <View
                    className={[
                      "h-12 w-12 items-center justify-center rounded-2xl border",
                      option.toneClass,
                    ].join(" ")}
                  >
                    <Icon
                      as={option.icon}
                      className={option.iconClass}
                      size={23}
                    />
                  </View>
                  <View className="flex-1 gap-1">
                    <Text className="text-lg font-bold text-white">
                      {option.label}
                    </Text>
                    <Text className="text-xs font-semibold uppercase tracking-wider text-amber-200/80">
                      {option.tagline}
                    </Text>
                    <Text className="text-sm leading-relaxed text-slate-400">
                      {option.description}
                    </Text>
                  </View>
                </View>

                {isSelected && (
                  <View className="h-7 w-7 items-center justify-center rounded-full bg-amber-300">
                    <Icon as={Check} className="text-slate-950" size={14} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )
        })}
      </View>

      <Button
        onPress={() => selected && onNext(selected)}
        disabled={!selected}
        size="lg"
        variant="accent"
      >
        <Text>Continue</Text>
      </Button>
    </View>
  )
}
