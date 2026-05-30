import * as React from "react"
import { View } from "react-native"

import { cn } from "@/lib/utils"

type GlassCardProps = React.ComponentPropsWithoutRef<typeof View> & {
  /** Use the opaque surface instead of the translucent glass fill. */
  solid?: boolean
}

/** Frosted-glass surface card — the workhorse container of the system. */
function GlassCard({ className, solid, ...props }: GlassCardProps) {
  return (
    <View
      className={cn(
        "rounded-[22px] border border-wl-border p-4",
        solid ? "bg-wl-surface-solid" : "bg-wl-surface",
        className
      )}
      {...props}
    />
  )
}

export { GlassCard }
