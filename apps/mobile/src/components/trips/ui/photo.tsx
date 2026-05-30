import { LinearGradient } from "expo-linear-gradient"
import type { LucideIcon } from "lucide-react-native"
import * as React from "react"
import { View } from "react-native"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { PhotoTones, type PhotoTone } from "@/constants/theme"
import { cn } from "@/lib/utils"

type PhotoProps = {
  tone?: PhotoTone
  className?: string
  children?: React.ReactNode
  label?: string
  icon?: LucideIcon
}

/**
 * Destination "photo" — a tinted mesh-gradient placeholder standing in for a
 * real image. Approximates the design's layered radial mesh with a diagonal
 * three-stop gradient per tone.
 */
function Photo({ tone = "sunset", className, children, label, icon }: PhotoProps) {
  const colors = PhotoTones[tone]
  return (
    <View className={cn("overflow-hidden", className)}>
      <LinearGradient
        colors={colors as unknown as [string, string, ...string[]]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={{ position: "absolute", inset: 0 }}
      />
      {(label || icon) && (
        <View className="absolute bottom-3 left-3 flex-row items-center gap-1.5">
          {icon && <Icon as={icon} size={14} className="text-white" />}
          {label && (
            <Text className="text-[12.5px] font-semibold text-white">
              {label}
            </Text>
          )}
        </View>
      )}
      {children}
    </View>
  )
}

export { Photo }
