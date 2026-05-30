import { View } from "react-native"

import { Text } from "@/components/ui/text"

import { Aurora } from "./aurora"

type DayPillProps = {
  weekday: string
  label: string
  active?: boolean
}

/** A day chip in the itinerary day selector. Active = aurora gradient. */
function DayPill({ weekday, label, active }: DayPillProps) {
  const inner = (
    <>
      <Text
        className={
          active
            ? "text-[11px] font-semibold text-white opacity-85"
            : "text-[11px] font-semibold text-foreground opacity-85"
        }
      >
        {weekday}
      </Text>
      <Text
        className={
          active
            ? "text-[15px] font-bold text-white"
            : "text-[15px] font-bold text-foreground"
        }
      >
        {label}
      </Text>
    </>
  )

  if (active) {
    return (
      <Aurora
        style={{
          width: 58,
          height: 62,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
          rowGap: 2,
        }}
      >
        {inner}
      </Aurora>
    )
  }

  return (
    <View className="h-[62px] w-[58px] items-center justify-center gap-0.5 rounded-2xl border border-wl-border bg-wl-surface-2">
      {inner}
    </View>
  )
}

export { DayPill }
