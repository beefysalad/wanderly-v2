import * as React from "react"
import { TextInput } from "react-native"

import { cn } from "@/lib/utils"

type InputProps = React.ComponentPropsWithoutRef<typeof TextInput>

function Input({
  className,
  placeholderTextColor = "#a1a1aa",
  ...props
}: InputProps) {
  return (
    <TextInput
      className={cn(
        "min-h-12 rounded-xl border border-input bg-background px-4 py-3.5 text-base text-foreground",
        "placeholder:text-muted-foreground",
        className
      )}
      placeholderTextColor={placeholderTextColor}
      {...props}
    />
  )
}

export { Input }
export type { InputProps }
