import * as React from "react"
import { View } from "react-native"

import { cn } from "@/lib/utils"

type AccentFillProps = React.ComponentPropsWithoutRef<typeof View>

/**
 * A solid coral accent surface — used for hero moments (primary CTA, FAB,
 * generation orb, budget hero, day selector). Replaces the earlier gradient.
 */
function AccentFill({ className, ...props }: AccentFillProps) {
  return <View {...props} className={cn("bg-accent", className)} />
}

export { AccentFill }
