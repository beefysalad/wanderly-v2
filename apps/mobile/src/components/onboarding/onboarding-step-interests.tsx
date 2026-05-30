import { TouchableOpacity, View } from "react-native"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

const INTERESTS: {
  value: string
  emoji: string
  label: string
  bgClass: string
  activeBgClass: string
  activeTextClass: string
}[] = [
  {
    value: "food",
    emoji: "🍜",
    label: "Food",
    bgClass: "bg-orange-50 dark:bg-orange-900/20",
    activeBgClass: "bg-orange-500",
    activeTextClass: "text-white",
  },
  {
    value: "nature",
    emoji: "🌿",
    label: "Nature",
    bgClass: "bg-green-50 dark:bg-green-900/20",
    activeBgClass: "bg-green-500",
    activeTextClass: "text-white",
  },
  {
    value: "culture",
    emoji: "🏛️",
    label: "Culture",
    bgClass: "bg-amber-50 dark:bg-amber-900/20",
    activeBgClass: "bg-amber-500",
    activeTextClass: "text-white",
  },
  {
    value: "nightlife",
    emoji: "🌙",
    label: "Nightlife",
    bgClass: "bg-indigo-50 dark:bg-indigo-900/20",
    activeBgClass: "bg-indigo-600",
    activeTextClass: "text-white",
  },
  {
    value: "adventure",
    emoji: "🏄",
    label: "Adventure",
    bgClass: "bg-red-50 dark:bg-red-900/20",
    activeBgClass: "bg-red-500",
    activeTextClass: "text-white",
  },
  {
    value: "beach",
    emoji: "🏖️",
    label: "Beach",
    bgClass: "bg-sky-50 dark:bg-sky-900/20",
    activeBgClass: "bg-sky-500",
    activeTextClass: "text-white",
  },
  {
    value: "history",
    emoji: "🏺",
    label: "History",
    bgClass: "bg-yellow-50 dark:bg-yellow-900/20",
    activeBgClass: "bg-yellow-600",
    activeTextClass: "text-white",
  },
  {
    value: "shopping",
    emoji: "🛍️",
    label: "Shopping",
    bgClass: "bg-pink-50 dark:bg-pink-900/20",
    activeBgClass: "bg-pink-500",
    activeTextClass: "text-white",
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
        <Text className="text-3xl font-bold text-zinc-900 dark:text-white">
          What are you into?
        </Text>
        <Text className="text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
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
                "flex-row items-center gap-2.5 rounded-2xl px-4 py-3",
                "border-2",
                isSelected
                  ? `${interest.activeBgClass} border-transparent`
                  : `${interest.bgClass} border-transparent`,
              ].join(" ")}
              style={{
                shadowColor: isSelected ? "#000" : "transparent",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isSelected ? 0.12 : 0,
                shadowRadius: 4,
                elevation: isSelected ? 3 : 0,
                transform: [{ scale: isSelected ? 1.04 : 1 }],
              }}
            >
              <Text className="text-xl">{interest.emoji}</Text>
              <Text
                className={[
                  "text-sm font-semibold",
                  isSelected
                    ? interest.activeTextClass
                    : "text-zinc-700 dark:text-zinc-300",
                ].join(" ")}
              >
                {interest.label}
              </Text>
              {isSelected && (
                <View className="ml-auto h-4 w-4 items-center justify-center rounded-full bg-white/30">
                  <Text className="text-[8px] font-bold text-white">✓</Text>
                </View>
              )}
            </TouchableOpacity>
          )
        })}
      </View>

      {/* Selection count */}
      {selected.size > 0 && (
        <View className="flex-row items-center gap-2">
          <View className="h-2 w-2 rounded-full bg-primary" />
          <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {selected.size} interest{selected.size > 1 ? "s" : ""} selected
          </Text>
        </View>
      )}

      <Button
        onPress={() => canFinish && onFinish(Array.from(selected))}
        disabled={!canFinish || isLoading}
        loading={isLoading}
        size="lg"
      >
        <Text>Let's go! 🚀</Text>
      </Button>
    </View>
  )
}
