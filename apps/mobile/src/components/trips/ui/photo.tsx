import { Image } from "expo-image"
import type { LucideIcon } from "lucide-react-native"
import * as React from "react"
import { View } from "react-native"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { PhotoTones, type PhotoTone } from "@/constants/theme"
import { cn } from "@/lib/utils"

type PhotoProps = {
  tone?: PhotoTone
  /** Real photography URL — fades in over the solid tone base when present. */
  src?: string | null
  /** Flat scrim over the image for legible overlaid text. */
  scrim?: boolean | "strong"
  className?: string
  children?: React.ReactNode
  label?: string
  icon?: LucideIcon
}

/**
 * Destination photo — a solid cool-tone base (Deep Ocean) with optional real
 * photography fading in over it, plus an optional flat scrim. No gradients:
 * depth comes from the solid fill and the flat scrim alone.
 */
function Photo({
  tone = "sunset",
  src,
  scrim,
  className,
  children,
  label,
  icon,
}: PhotoProps) {
  return (
    <View
      className={cn("overflow-hidden", className)}
      style={{ backgroundColor: PhotoTones[tone] }}
    >
      {src ? (
        <Image
          source={{ uri: src }}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={400}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />
      ) : null}
      {scrim ? (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor:
              scrim === "strong" ? "rgba(5,9,14,0.66)" : "rgba(5,9,14,0.46)",
          }}
        />
      ) : null}
      {label || icon ? (
        <View className="absolute bottom-3 left-3 flex-row items-center gap-1.5">
          {icon && <Icon as={icon} size={14} className="text-white" />}
          {label && (
            <Text className="text-[12.5px] font-semibold text-white">
              {label}
            </Text>
          )}
        </View>
      ) : null}
      {children}
    </View>
  )
}

export { Photo }
