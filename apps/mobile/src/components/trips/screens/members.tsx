import { useRouter } from "expo-router"
import { Copy, Link2 } from "lucide-react-native"
import { View } from "react-native"

import { Text } from "@/components/ui/text"

import { GlassCard } from "../ui/glass-card"
import { GradientAvatar } from "../ui/gradient-avatar"
import { ScreenGlow } from "../ui/screen-glow"
import { ScreenHeader } from "../ui/screen-header"
import { TripButton } from "../ui/trip-button"
import { Icon } from "@/components/ui/icon"
import { SafeAreaView } from "react-native-safe-area-context"
import { ScrollView } from "react-native"

const QR_PATTERN = [
  "1110111",
  "1000001",
  "1011101",
  "1011101",
  "1011101",
  "1000001",
  "1110111",
]

/** Deterministic decorative QR-ish glyph (placeholder for a real invite QR). */
function QrGlyph() {
  return (
    <View className="h-24 w-24 justify-center rounded-xl bg-white p-2">
      {QR_PATTERN.map((row, y) => (
        <View key={y} className="flex-row">
          {row.split("").map((c, x) => (
            <View
              key={`${y}-${x}`}
              style={{
                flex: 1,
                aspectRatio: 1,
                margin: 0.5,
                borderRadius: 1,
                backgroundColor: c === "1" ? "#111" : "transparent",
              }}
            />
          ))}
        </View>
      ))}
    </View>
  )
}

const MEMBERS = [
  { n: "Maya Reyes", r: "Owner", i: 0, you: true },
  { n: "Jan Cruz", r: "Member", i: 1 },
  { n: "Bea Lim", r: "Member", i: 2 },
  { n: "Kiko Tan", r: "Member", i: 3 },
  { n: "Rey Go", r: "Member", i: 4 },
]

/** 11 · Members / join by code. */
export function Members() {
  const router = useRouter()

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScreenGlow />
      <View className="flex-1 px-5">
        <ScreenHeader
          onBack={() => router.back()}
          title="Trip members"
          subtitle="Palawan Barkada · 6 going"
        />

        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-8"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center gap-4 rounded-3xl border border-wl-border bg-wl-surface p-[18px]">
            <QrGlyph />
            <View className="flex-1">
              <Text className="text-[14.5px] font-bold text-foreground">
                Invite your crew
              </Text>
              <Text className="mt-0.5 text-xs leading-relaxed text-wl-text-2">
                Share the code or link — anyone can hop in.
              </Text>
              <View className="mt-2.5 flex-row items-center gap-2 rounded-xl border border-dashed border-wl-accent-line bg-wl-surface-2 px-3 py-2">
                <Text className="flex-1 text-[17px] font-extrabold tracking-[2px] text-wl-accent">
                  WND-4K2P
                </Text>
                <Icon as={Copy} size={17} className="text-wl-text-2" />
              </View>
            </View>
          </View>

          <View className="mt-3">
            <TripButton variant="primary" icon={Link2} full>
              Share invite link
            </TripButton>
          </View>

          <View className="mb-2.5 mt-5 flex-row items-center justify-between">
            <Text className="text-[14.5px] font-bold text-foreground">
              Members
            </Text>
            <Text className="text-[13px] font-semibold text-wl-text-2">6</Text>
          </View>

          <GlassCard className="p-0">
            {MEMBERS.map((m, i) => (
              <View
                key={m.n}
                className="flex-row items-center gap-3 px-3.5 py-3"
                style={{
                  borderBottomWidth: i < MEMBERS.length - 1 ? 1 : 0,
                  borderColor: "rgba(255,255,255,0.1)",
                }}
              >
                <GradientAvatar name={m.n} size={40} i={m.i} />
                <View className="flex-1">
                  <Text className="text-[14.5px] font-bold text-foreground">
                    {m.n}
                    {m.you && (
                      <Text className="font-medium text-wl-text-3"> · you</Text>
                    )}
                  </Text>
                  <Text className="mt-px text-xs text-wl-text-2">
                    {m.r === "Owner"
                      ? "Can manage trip & members"
                      : "Can edit itinerary & expenses"}
                  </Text>
                </View>
                <Text
                  className={
                    m.r === "Owner"
                      ? "overflow-hidden rounded-full border border-wl-border bg-wl-accent-soft px-2.5 py-1 text-[11.5px] font-bold text-wl-accent"
                      : "overflow-hidden rounded-full border border-wl-border bg-wl-surface-2 px-2.5 py-1 text-[11.5px] font-bold text-wl-text-2"
                  }
                >
                  {m.r}
                </Text>
              </View>
            ))}
          </GlassCard>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
