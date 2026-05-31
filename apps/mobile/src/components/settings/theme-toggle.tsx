import { Moon, Smartphone, Sun, type LucideIcon } from "lucide-react-native"
import { Pressable, View } from "react-native"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import {
  useThemePreference,
  type ThemePreference,
} from "@/hooks/use-theme-preference"
import { cn } from "@/lib/utils"

const OPTIONS: { value: ThemePreference; label: string; icon: LucideIcon }[] = [
  { value: "system", label: "System", icon: Smartphone },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
]

/** Segmented System / Light / Dark control wired to the theme preference. */
export function ThemeToggle() {
  const { preference, setPreference } = useThemePreference()

  return (
    <View className="flex-row gap-1 rounded-2xl border border-wl-border bg-wl-surface p-1">
      {OPTIONS.map((option) => {
        const active = preference === option.value
        return (
          <Pressable
            key={option.value}
            onPress={() => setPreference(option.value)}
            className={cn(
              "flex-1 flex-row items-center justify-center gap-1.5 rounded-xl py-2.5",
              active && "bg-accent"
            )}
          >
            <Icon
              as={option.icon}
              size={16}
              className={active ? "text-accent-foreground" : "text-wl-text-2"}
            />
            <Text
              className={cn(
                "text-[13px] font-bold",
                active ? "text-accent-foreground" : "text-wl-text-2"
              )}
            >
              {option.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
