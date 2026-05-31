import type { LucideIcon } from "lucide-react-native"
import { Pressable } from "react-native"

import { Icon } from "@/components/ui/icon"

type OverlayIconButtonProps = {
  icon: LucideIcon
  onPress?: () => void
}

/** Glass round button that floats over a hero photo (back / share / more). */
function OverlayIconButton({ icon, onPress }: OverlayIconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{ backgroundColor: "rgba(10,10,15,0.4)" }}
      className="h-10 w-10 items-center justify-center rounded-[13px] border border-white/20"
    >
      <Icon as={icon} size={19} className="text-white" />
    </Pressable>
  )
}

export { OverlayIconButton }
