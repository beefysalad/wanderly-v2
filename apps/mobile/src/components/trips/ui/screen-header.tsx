import { ArrowLeft } from "lucide-react-native"
import * as React from "react"
import { Pressable, View } from "react-native"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

type ScreenHeaderProps = {
  title: string
  subtitle?: string
  right?: React.ReactNode
  onBack?: () => void
}

/** Title row with optional back affordance and trailing slot. */
function ScreenHeader({ title, subtitle, right, onBack }: ScreenHeaderProps) {
  return (
    <View className="flex-row items-center gap-3 pb-3.5 pt-1.5">
      {onBack !== undefined && (
        <Pressable
          onPress={onBack}
          className="h-10 w-10 items-center justify-center rounded-[13px] border border-wl-border bg-wl-surface-2"
        >
          <Icon as={ArrowLeft} size={20} className="text-foreground" />
        </Pressable>
      )}
      <View className="min-w-0 flex-1">
        <Text className="text-[21px] font-extrabold tracking-tight text-foreground">
          {title}
        </Text>
        {subtitle && (
          <Text className="mt-0.5 text-[13px] text-wl-text-2">{subtitle}</Text>
        )}
      </View>
      {right}
    </View>
  )
}

export { ScreenHeader }
