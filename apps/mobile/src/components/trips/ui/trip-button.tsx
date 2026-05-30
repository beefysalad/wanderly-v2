import type { LucideIcon } from "lucide-react-native"
import * as React from "react"
import { Pressable, type StyleProp, type ViewStyle } from "react-native"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { cn } from "@/lib/utils"

import { Aurora } from "./aurora"

type TripButtonVariant = "primary" | "solid" | "soft" | "glass" | "ghost"
type TripButtonSize = "sm" | "md" | "lg"

type TripButtonProps = {
  children?: React.ReactNode
  variant?: TripButtonVariant
  size?: TripButtonSize
  icon?: LucideIcon
  iconRight?: LucideIcon
  full?: boolean
  onPress?: () => void
  className?: string
  style?: StyleProp<ViewStyle>
}

const HEIGHTS: Record<TripButtonSize, number> = { sm: 38, md: 50, lg: 56 }
const FONTS: Record<TripButtonSize, number> = { sm: 14, md: 15.5, lg: 17 }
const ICON_SIZES: Record<TripButtonSize, number> = { sm: 16, md: 18, lg: 20 }

const SURFACE: Record<TripButtonVariant, string> = {
  primary: "",
  solid: "bg-accent",
  soft: "bg-wl-accent-soft",
  glass: "border border-wl-border-2 bg-wl-surface-2",
  ghost: "border border-wl-border-2 bg-transparent",
}
const LABEL: Record<TripButtonVariant, string> = {
  primary: "text-white",
  solid: "text-accent-foreground",
  soft: "text-wl-accent",
  glass: "text-foreground",
  ghost: "text-wl-text-2",
}

/** Design-system button. `primary` wears the aurora gradient + glow. */
function TripButton({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  full,
  onPress,
  className,
  style,
}: TripButtonProps) {
  const labelClass = LABEL[variant]
  const content = (
    <>
      {icon && (
        <Icon as={icon} size={ICON_SIZES[size]} className={labelClass} />
      )}
      {children != null && (
        <Text
          style={{ fontSize: FONTS[size] }}
          className={cn("font-bold", labelClass)}
        >
          {children}
        </Text>
      )}
      {iconRight && (
        <Icon as={iconRight} size={ICON_SIZES[size]} className={labelClass} />
      )}
    </>
  )

  const radius = size === "sm" ? 12 : 16
  const base: ViewStyle = {
    height: HEIGHTS[size],
    borderRadius: radius,
    paddingHorizontal: size === "lg" ? 24 : size === "sm" ? 14 : 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 9,
    alignSelf: full ? "stretch" : "flex-start",
  }

  if (variant === "primary") {
    return (
      <Pressable
        onPress={onPress}
        style={[
          {
            borderRadius: radius,
            alignSelf: full ? "stretch" : "flex-start",
            shadowColor: "#7C6BFF",
            shadowOpacity: 0.5,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 10 },
            elevation: 8,
          },
          style,
        ]}
        className={className}
      >
        <Aurora
          style={{
            ...base,
            alignSelf: "stretch",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.22)",
          }}
        >
          {content}
        </Aurora>
      </Pressable>
    )
  }

  return (
    <Pressable
      onPress={onPress}
      style={[base, style]}
      className={cn(SURFACE[variant], className)}
    >
      {content}
    </Pressable>
  )
}

export { TripButton }
export type { TripButtonProps }
