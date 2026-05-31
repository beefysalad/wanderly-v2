import { LinearGradient } from "expo-linear-gradient"
import { useColorScheme } from "nativewind"

/**
 * The faint violet "dusk" glow bleeding from the top of every screen —
 * approximates the design's radial background gradient. Dark mode only;
 * on light surfaces the flat background already reads correctly.
 */
function ScreenGlow() {
  const { colorScheme } = useColorScheme()
  if (colorScheme !== "dark") return null
  return (
    <LinearGradient
      colors={["#16131F", "rgba(11,12,16,0)"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      pointerEvents="none"
      style={{ position: "absolute", top: 0, left: 0, right: 0, height: 360 }}
    />
  )
}

export { ScreenGlow }
