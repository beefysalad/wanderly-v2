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
  activeClass: string
  iconClass: string
}[] = [
  {
    value: "food",
    icon: Utensils,
    label: "Food",
    activeClass: "border-orange-400/60 bg-orange-500/20",
    iconClass: "text-orange-300",
  },
  {
    value: "nature",
    icon: Trees,
    label: "Nature",
    activeClass: "border-emerald-400/60 bg-emerald-500/20",
    iconClass: "text-emerald-300",
  },
  {
    value: "culture",
    icon: Landmark,
    label: "Culture",
    activeClass: "border-violet-400/60 bg-violet-500/20",
    iconClass: "text-violet-300",
  },
  {
    value: "nightlife",
    icon: Moon,
    label: "Nightlife",
    activeClass: "border-indigo-400/60 bg-indigo-500/20",
    iconClass: "text-indigo-300",
  },
  {
    value: "adventure",
    icon: Bike,
    label: "Adventure",
    activeClass: "border-red-400/60 bg-red-500/20",
    iconClass: "text-red-300",
  },
  {
    value: "beach",
    icon: Waves,
    label: "Beach",
    activeClass: "border-sky-400/60 bg-sky-500/20",
    iconClass: "text-sky-300",
  },
  {
    value: "history",
    icon: Mountain,
    label: "History",
    activeClass: "border-yellow-400/60 bg-yellow-500/20",
    iconClass: "text-yellow-300",
  },
  {
    value: "shopping",
    icon: ShoppingBag,
    label: "Shopping",
    activeClass: "border-pink-400/60 bg-pink-500/20",
    iconClass: "text-pink-300",
  },
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
        <Text className="text-3xl font-bold text-white">
          What are you into?
        </Text>
        <Text className="text-base leading-relaxed text-slate-400">
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
                  ? interest.activeClass
                  : "border-white/10 bg-white/5",
              ].join(" ")}
              style={{
                shadowColor: isSelected ? "#f59e0b" : "transparent",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isSelected ? 0.12 : 0,
                shadowRadius: 4,
                elevation: isSelected ? 3 : 0,
              }}
            >
              <Icon
                as={interest.icon}
                className={interest.iconClass}
                size={18}
              />
              <Text className="text-sm font-semibold text-white">
                {interest.label}
              </Text>
              {isSelected && (
                <View className="ml-auto h-4 w-4 items-center justify-center rounded-full bg-white/20">
                  <Icon as={Check} className="text-violet-200" size={10} />
                </View>
              )}
            </TouchableOpacity>
          )
        })}
      </View>

      {/* Selection count */}
      {selected.size > 0 && (
        <View className="flex-row items-center gap-2">
          <View className="h-2 w-2 rounded-full bg-violet-300" />
          <Text className="text-sm font-medium text-slate-400">
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
