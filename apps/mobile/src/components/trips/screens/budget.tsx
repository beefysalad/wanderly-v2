import {
  Bed,
  type LucideIcon,
  Plane,
  Plus,
  Receipt,
  Users,
  Utensils,
  Waves,
} from "lucide-react-native"
import { Pressable, ScrollView, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

import { AccentFill } from "../ui/accent-fill"
import { GlassCard } from "../ui/glass-card"
import { GradientAvatar } from "../ui/gradient-avatar"
import { ScreenGlow } from "../ui/screen-glow"
import { TripButton } from "../ui/trip-button"

type Settlement = {
  person: string
  personIndex: number
  amount: string
  owe?: boolean
}

const SETTLEMENTS: Settlement[] = [
  { person: "Kiko Tan", personIndex: 3, amount: "₱840" },
  { person: "Rey Go", personIndex: 4, amount: "₱400" },
  { person: "Bea Lim", personIndex: 2, amount: "₱200", owe: true },
]

const CATEGORIES: [string, string, LucideIcon][] = [
  ["Stays", "₱8.2k", Bed],
  ["Food", "₱4.6k", Utensils],
  ["Tours", "₱5.6k", Waves],
]

/** 10 · Budget — trip spend first, collaboration settlement second. */
export function Budget() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScreenGlow />
      <View className="flex-1 px-5">
        <View className="flex-row items-center justify-between pt-3.5">
          <View>
            <Text className="text-2xl font-extrabold tracking-tight text-foreground">
              Budget
            </Text>
            <View className="mt-px flex-row items-center gap-1.5">
              <Icon as={Plane} size={13} className="text-wl-text-2" />
              <Text className="text-[13px] text-wl-text-2">
                Surf & Slow Mornings · Solo trip
              </Text>
            </View>
          </View>
          <TripButton variant="soft" size="sm" icon={Plus}>
            Expense
          </TripButton>
        </View>

        <ScrollView
          className="-mx-5 mt-3.5 flex-1"
          contentContainerClassName="px-5 pb-32"
          showsVerticalScrollIndicator={false}
        >
          <AccentFill style={{ borderRadius: 24, padding: 18 }}>
            <Text className="text-[13px] font-semibold text-white opacity-90">
              Trip spend
            </Text>
            <Text className="mt-1 text-4xl font-extrabold tracking-tighter text-white">
              ₱18,400
            </Text>
            <Text className="mt-1 text-[13px] font-semibold text-white opacity-85">
              ₱11,600 remaining of ₱30,000
            </Text>
            <View className="mt-3.5 flex-row gap-2.5">
              <Pressable className="h-[38px] flex-row items-center gap-1.5 rounded-xl bg-white px-3.5">
                <Icon as={Plus} size={16} className="text-[#E0533F]" />
                <Text className="text-sm font-bold text-[#E0533F]">Expense</Text>
              </Pressable>
              <Pressable
                style={{ backgroundColor: "rgba(255,255,255,0.16)" }}
                className="h-[38px] flex-row items-center gap-1.5 rounded-xl border border-white/30 px-3.5"
              >
                <Icon as={Receipt} size={16} className="text-white" />
                <Text className="text-sm font-bold text-white">
                  All expenses
                </Text>
              </Pressable>
            </View>
          </AccentFill>

          <Text className="mb-2.5 mt-4 text-[14.5px] font-bold text-foreground">
            Categories
          </Text>
          <GlassCard>
            <View className="flex-row items-baseline justify-between">
              <Text className="text-xl font-extrabold text-foreground">
                61% used
              </Text>
              <Text className="text-[13px] font-semibold text-wl-text-2">
                Solo actuals
              </Text>
            </View>
            <View className="mt-2.5 h-[9px] overflow-hidden rounded-md bg-wl-surface-2">
              <AccentFill style={{ width: "61%", height: "100%" }} />
            </View>
            <View className="mt-3.5 flex-row gap-4">
              {CATEGORIES.map(([label, amount, icon]) => (
                <View key={label} className="flex-row items-center gap-1.5">
                  <Icon as={icon} size={15} className="text-accent" />
                  <View>
                    <Text className="text-[13px] font-bold text-foreground">
                      {amount}
                    </Text>
                    <Text className="text-[10.5px] text-wl-text-3">
                      {label}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </GlassCard>

          <View className="mb-2.5 mt-5 flex-row items-center justify-between">
            <Text className="text-[14.5px] font-bold text-foreground">
              Collaboration & sharing
            </Text>
            <View className="flex-row items-center gap-1.5">
              <Icon as={Users} size={13} className="text-wl-text-2" />
              <Text className="text-[12.5px] font-semibold text-wl-text-2">
                Group trips
              </Text>
            </View>
          </View>

          <GlassCard className="mb-3">
            <Text className="text-[13.5px] font-semibold text-wl-text-2">
              Split balances and settle-up appear once this trip has members.
            </Text>
          </GlassCard>

          <Text className="mb-2.5 text-[14.5px] font-bold text-foreground">
            Group settle-up preview
          </Text>
          <GlassCard className="p-0">
            {SETTLEMENTS.map((r, i) => (
              <View
                key={r.person}
                className="flex-row items-center gap-3 px-3.5 py-3"
                style={{
                  borderBottomWidth: i < SETTLEMENTS.length - 1 ? 1 : 0,
                  borderColor: "rgba(255,255,255,0.1)",
                }}
              >
                <GradientAvatar name={r.person} size={36} i={r.personIndex} />
                <Text className="flex-1 text-[13.5px] text-foreground">
                  {r.owe ? (
                    <Text className="text-[13.5px] text-foreground">
                      <Text className="font-bold">You</Text> owe{" "}
                      <Text className="font-bold">{r.person.split(" ")[0]}</Text>
                    </Text>
                  ) : (
                    <Text className="text-[13.5px] text-foreground">
                      <Text className="font-bold">
                        {r.person.split(" ")[0]}
                      </Text>{" "}
                      owes you
                    </Text>
                  )}
                </Text>
                <Text
                  className={
                    r.owe
                      ? "text-[15px] font-extrabold text-wl-accent-2"
                      : "text-[15px] font-extrabold text-accent"
                  }
                >
                  {r.amount}
                </Text>
              </View>
            ))}
          </GlassCard>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
