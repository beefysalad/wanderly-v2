import * as React from "react"
import { ActivityIndicator, Platform, Pressable } from "react-native"
import { cva, type VariantProps } from "class-variance-authority"

import { TextClassContext } from "@/components/ui/text"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  cn(
    "group min-h-12 shrink-0 flex-row items-center justify-center gap-2 rounded-xl shadow-none",
    Platform.select({
      web: "whitespace-nowrap outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none",
    })
  ),
  {
    variants: {
      variant: {
        default: cn(
          "bg-primary active:bg-primary/90",
          Platform.select({ web: "hover:bg-primary/90" })
        ),
        secondary: cn(
          "bg-secondary active:bg-secondary/80",
          Platform.select({ web: "hover:bg-secondary/80" })
        ),
        outline: cn(
          "border border-border bg-background active:bg-accent/10",
          Platform.select({ web: "hover:bg-accent/10" })
        ),
        ghost: cn(
          "active:bg-accent/10",
          Platform.select({ web: "hover:bg-accent/10" })
        ),
        destructive: cn(
          "bg-destructive active:bg-destructive/90",
          Platform.select({ web: "hover:bg-destructive/90" })
        ),
        link: "min-h-0 px-0 py-0",
      },
      size: {
        default: "px-5 py-3",
        sm: "min-h-10 rounded-lg px-4 py-2",
        lg: "min-h-14 rounded-xl px-6 py-4",
        icon: "h-12 w-12 px-0 py-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const buttonTextVariants = cva("text-base font-bold", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      outline: "text-foreground",
      ghost: "text-foreground",
      destructive: "text-destructive-foreground",
      link: "text-primary",
    },
    size: {
      default: "",
      sm: "text-sm",
      lg: "",
      icon: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean
  }

function Button({
  className,
  disabled,
  loading,
  size,
  variant,
  children,
  ...props
}: ButtonProps) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <Pressable
        className={cn(
          buttonVariants({ variant, size }),
          (disabled || loading) && "opacity-60",
          className
        )}
        disabled={disabled || loading}
        role="button"
        {...props}
      >
        {loading ? <ActivityIndicator color="#FFFFFF" /> : children}
      </Pressable>
    </TextClassContext.Provider>
  )
}

export { Button, buttonTextVariants, buttonVariants }
export type { ButtonProps }
