import { LinearGradient } from "expo-linear-gradient"
import { View } from "react-native"

type PremiumBackgroundProps = {
  variant?: "default" | "orange"
}

export function PremiumBackground({
  variant = "default",
}: PremiumBackgroundProps) {
  const firstGlow =
    variant === "orange" ? "bg-orange-500/20" : "bg-purple-500/20"

  return (
    <View
      className="absolute inset-0 overflow-hidden bg-slate-950"
      pointerEvents="none"
    >
      <LinearGradient
        colors={["#020617", "#0f172a", "#020617"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />
      <View
        className={`absolute -left-28 -top-24 h-80 w-80 rounded-full ${firstGlow}`}
      />
      <View className="absolute -bottom-24 -right-28 h-80 w-80 rounded-full bg-amber-500/20" />
      <View className="absolute right-8 top-44 h-44 w-44 rounded-full bg-blue-500/10" />
      <View className="absolute left-6 top-1/2 h-32 w-32 rounded-full bg-emerald-500/10" />
      <View className="absolute bottom-0 left-0 right-0 h-px bg-white/20" />
    </View>
  )
}
