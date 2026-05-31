import type { LucideIcon } from "lucide-react-native"
import * as React from "react"
import { View } from "react-native"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { cn } from "@/lib/utils"

type ChipProps = {
  children: React.ReactNode
  active?: boolean
  icon?: LucideIcon
  className?: string
}

/** Pill filter/tag. Active = solid accent; rest = glass surface. */
function Chip({ children, active, icon, className }: ChipProps) {
  return (
    <View
      className={cn(
        "h-8 flex-row items-center gap-1.5 rounded-full border px-3",
        active
          ? "border-transparent bg-accent"
          : "border-wl-border bg-wl-surface-2",
        className
      )}
    >
      {icon && (
        <Icon
          as={icon}
          size={14}
          className={active ? "text-accent-foreground" : "text-wl-text-2"}
        />
      )}
      <Text
        className={cn(
          "text-[13px] font-semibold",
          active ? "text-accent-foreground" : "text-wl-text-2"
        )}
      >
        {children}
      </Text>
    </View>
  )
}

export { Chip }
