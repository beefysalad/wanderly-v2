import * as React from "react"
import { Platform, Text as RNText } from "react-native"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const TextClassContext = React.createContext<string | undefined>(undefined)

const textVariants = cva(
  cn("text-foreground", Platform.select({ web: "select-text" })),
  {
    variants: {
      variant: {
        default: "text-base",
        muted: "text-sm text-muted-foreground",
        label: "text-sm font-semibold text-foreground",
        heading: "text-3xl font-bold text-foreground",
        title: "text-xl font-bold text-foreground",
        caption: "text-xs font-medium text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type TextProps = React.ComponentPropsWithoutRef<typeof RNText> &
  VariantProps<typeof textVariants>

function Text({ className, variant, ...props }: TextProps) {
  const textClassName = React.useContext(TextClassContext)

  return (
    <RNText
      className={cn(textVariants({ variant }), textClassName, className)}
      {...props}
    />
  )
}

export { Text, TextClassContext, textVariants }
export type { TextProps }
