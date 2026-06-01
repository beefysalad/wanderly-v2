import type { LucideIcon } from "lucide-react-native"
import * as React from "react"
import { View } from "react-native"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

import { AccentFill } from "./accent-fill"

type HeroPillProps = {
  children: React.ReactNode
  icon?: LucideIcon
  /** "glass" sits on a photo; "aurora" is the solid teal highlight pill. */
  tone?: "glass" | "aurora"
}

/** Small pill badge used over destination photos (counts, countdowns, modes). */
function HeroPill({ children, icon, tone = "glass" }: HeroPillProps) {
  const label = (
    <>
      {icon && <Icon as={icon} size={13} className="text-white" />}
      <Text className="text-[12.5px] font-bold text-white">{children}</Text>
    </>
  )

  if (tone === "aurora") {
    return (
      <AccentFill
        style={{
          height: 30,
          borderRadius: 999,
          paddingHorizontal: 12,
          flexDirection: "row",
          alignItems: "center",
          columnGap: 6,
        }}
      >
        {icon && (
          <Icon as={icon} size={13} className="text-accent-foreground" />
        )}
        <Text className="text-[12.5px] font-bold text-accent-foreground">
          {children}
        </Text>
      </AccentFill>
    )
  }

  return (
    <View
      style={{ backgroundColor: "rgba(10,10,15,0.42)" }}
      className="h-[30px] flex-row items-center gap-1.5 rounded-full border border-white/20 px-3"
    >
      {label}
    </View>
  )
}

export { HeroPill }
