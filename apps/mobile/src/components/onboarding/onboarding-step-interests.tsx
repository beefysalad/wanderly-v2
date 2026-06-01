import {
  Bike,
  Check,
  Landmark,
  Moon,
  Mountain,
  ShoppingBag,
  Trees,
  Utensils,
  Waves,
} from "lucide-react-native"
import { TouchableOpacity, View } from "react-native"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

const INTERESTS: {
  value: string
  icon: typeof Utensils
  label: string
}[] = [
  { value: "food", icon: Utensils, label: "Food" },
  { value: "nature", icon: Trees, label: "Nature" },
  { value: "culture", icon: Landmark, label: "Culture" },
  { value: "nightlife", icon: Moon, label: "Nightlife" },
  { value: "adventure", icon: Bike, label: "Adventure" },
  { value: "beach", icon: Waves, label: "Beach" },
  { value: "history", icon: Mountain, label: "History" },
  { value: "shopping", icon: ShoppingBag, label: "Shopping" },
]

type Props = {
  onFinish: (interests: string[]) => void
  isLoading?: boolean
}

export function OnboardingStepInterests({ onFinish, isLoading }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function toggle(value: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return next
    })
  }

  const canFinish = selected.size > 0

  return (
    <View className="gap-8">
      <View className="gap-2">
        <Text className="text-3xl font-bold text-foreground">
          What are you into?
        </Text>
        <Text className="text-base leading-relaxed text-wl-text-2">
          Pick at least one. Your AI itineraries will be tailored to these.
        </Text>
      </View>

      {/* Interest grid — 2 columns */}
      <View className="flex-row flex-wrap gap-3">
        {INTERESTS.map((interest) => {
          const isSelected = selected.has(interest.value)
          return (
            <TouchableOpacity
              key={interest.value}
              onPress={() => toggle(interest.value)}
              activeOpacity={0.8}
              className={[
                "min-w-[45%] flex-row items-center gap-2.5 rounded-2xl border px-4 py-3",
                isSelected
                  ? "border-wl-accent-line bg-wl-accent-soft"
                  : "border-wl-border bg-wl-surface",
              ].join(" ")}
            >
              <Icon
                as={interest.icon}
                className={isSelected ? "text-wl-accent" : "text-wl-text-2"}
                size={18}
              />
              <Text className="text-sm font-semibold text-foreground">
                {interest.label}
              </Text>
              {isSelected && (
                <View className="ml-auto h-4 w-4 items-center justify-center rounded-full bg-wl-accent-soft">
                  <Icon as={Check} className="text-wl-accent" size={10} />
                </View>
              )}
            </TouchableOpacity>
          )
        })}
      </View>

      {/* Selection count */}
      {selected.size > 0 && (
        <View className="flex-row items-center gap-2">
          <View className="h-2 w-2 rounded-full bg-accent" />
          <Text className="text-sm font-medium text-wl-text-2">
            {selected.size} interest{selected.size > 1 ? "s" : ""} selected
          </Text>
        </View>
      )}

      <Button
        onPress={() => canFinish && onFinish(Array.from(selected))}
        disabled={!canFinish || isLoading}
        loading={isLoading}
        size="lg"
        variant="accent"
      >
        <Text>Finish onboarding</Text>
      </Button>
    </View>
  )
}
