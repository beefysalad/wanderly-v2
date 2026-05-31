import { ChevronRight, type LucideIcon } from "lucide-react-native"
import { Pressable, View } from "react-native"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

type ProfileLinkRowProps = {
  icon: LucideIcon
  label: string
  onPress?: () => void
  last?: boolean
}

function ProfileLinkRow({ icon, label, onPress, last }: ProfileLinkRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 px-3.5 py-3.5"
      style={{
        borderBottomWidth: last ? 0 : 1,
        borderColor: "rgba(255,255,255,0.1)",
      }}
    >
      <View className="h-9 w-9 items-center justify-center rounded-xl bg-wl-accent-soft">
        <Icon as={icon} size={18} className="text-wl-accent" />
      </View>
      <Text className="flex-1 text-[15px] font-semibold text-foreground">
        {label}
      </Text>
      <Icon as={ChevronRight} size={18} className="text-wl-text-3" />
    </Pressable>
  )
}

export { ProfileLinkRow }
export type { ProfileLinkRowProps }
