import { LinearGradient } from "expo-linear-gradient"
import { View } from "react-native"

import { Text } from "@/components/ui/text"
import { cn } from "@/lib/utils"

const AVATAR_GRADIENTS: [string, string][] = [
  ["#7C6BFF", "#FF6B8A"],
  ["#22B8C9", "#6EE7B7"],
  ["#FF8A5C", "#FF4D8D"],
  ["#5B9DFF", "#A78BFA"],
  ["#F5B14C", "#FF6B8A"],
  ["#34D399", "#22B8C9"],
]

type GradientAvatarProps = {
  name?: string
  size?: number
  /** Index selecting one of the deterministic gradient pairs. */
  i?: number
  /** Draw a ring (bg-colored border) for stacked/overlapping avatars. */
  ring?: boolean
}

/** Circular avatar with initials over a deterministic gradient. */
function GradientAvatar({ name = "", size = 34, i = 0, ring }: GradientAvatarProps) {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
  const colors = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]

  return (
    <View
      className={cn("overflow-hidden", ring && "border-2 border-background")}
      style={{ width: size, height: size, borderRadius: size / 2 }}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Text
          style={{ fontSize: size * 0.36 }}
          className="font-bold text-white"
        >
          {initials}
        </Text>
      </LinearGradient>
    </View>
  )
}

export { GradientAvatar }
