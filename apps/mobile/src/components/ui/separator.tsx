import * as React from "react"
import * as SeparatorPrimitive from "@rn-primitives/separator"

import { cn } from "@/lib/utils"

type SeparatorProps = React.ComponentPropsWithoutRef<
  typeof SeparatorPrimitive.Root
>

function Separator({
  className,
  decorative = true,
  orientation = "horizontal",
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal"
          ? "h-hairline w-full"
          : "w-hairline h-full",
        className
      )}
      decorative={decorative}
      orientation={orientation}
      {...props}
    />
  )
}

export { Separator }
export type { SeparatorProps }
