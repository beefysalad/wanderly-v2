import { LinearGradient } from "expo-linear-gradient"
import { cssInterop } from "nativewind"
import * as React from "react"

import { AuroraGradient } from "@/constants/theme"

cssInterop(LinearGradient, { className: { target: "style" } })

type AuroraProps = Omit<
  React.ComponentPropsWithoutRef<typeof LinearGradient>,
  "colors" | "locations" | "start" | "end"
>

/**
 * The signature violet → coral "aurora" gradient as a fillable box.
 * Reserved for hero moments (primary CTA, generation orb, budget hero).
 */
function Aurora({ children, ...props }: AuroraProps) {
  return (
    <LinearGradient
      {...props}
      colors={AuroraGradient.colors as unknown as [string, string, ...string[]]}
      locations={
        AuroraGradient.locations as unknown as [number, number, ...number[]]
      }
      start={AuroraGradient.start}
      end={AuroraGradient.end}
    >
      {children}
    </LinearGradient>
  )
}

export { Aurora }
