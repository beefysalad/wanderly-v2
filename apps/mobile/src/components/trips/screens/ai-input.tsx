import { useRouter } from "expo-router"
import { Calendar, MapPin, User, Wand2 } from "lucide-react-native"
import { ScrollView, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

import { Chip } from "../ui/chip"
import { GlassCard } from "../ui/glass-card"
import { ScreenGlow } from "../ui/screen-glow"
import { ScreenHeader } from "../ui/screen-header"
import { TripButton } from "../ui/trip-button"

const VIBES = [
  "Surf",
  "Foodie",
  "Chill",
  "Nightlife",
  "Nature",
  "Culture",
  "Budget",
  "Luxe",
]
const ACTIVE = ["Surf", "Chill", "Nature"]

function FieldLabel({ children }: { children: string }) {
  return (
    <Text className="text-[12px] font-bold uppercase tracking-wider text-wl-text-3">
      {children}
    </Text>
  )
}

/** 04 · AI generator — set the vibe. */
export function AiInput() {
  const router = useRouter()

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScreenGlow />
      <View className="flex-1 px-5">
        <ScreenHeader
          onBack={() => router.back()}
          title="Plan with AI"
          subtitle="A full day-by-day plan in ~30s"
        />

        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-3.5 pb-8"
          showsVerticalScrollIndicator={false}
        >
          <GlassCard className="gap-1">
            <FieldLabel>Destination</FieldLabel>
            <View className="mt-1 flex-row items-center gap-2.5">
              <Icon as={MapPin} size={20} className="text-accent" />
              <Text className="text-lg font-bold text-foreground">
                Siargao, Philippines
              </Text>
            </View>
          </GlassCard>

          <View className="flex-row gap-3">
            <GlassCard className="flex-1">
              <FieldLabel>Dates</FieldLabel>
              <View className="mt-2 flex-row items-center gap-2">
                <Icon as={Calendar} size={18} className="text-accent" />
                <Text className="text-[14.5px] font-bold text-foreground">
                  12–16 Jun
                </Text>
              </View>
              <Text className="mt-1 text-xs text-wl-text-2">5 days</Text>
            </GlassCard>
            <GlassCard className="flex-1">
              <FieldLabel>Travellers</FieldLabel>
              <View className="mt-2 flex-row items-center gap-2">
                <Icon as={User} size={18} className="text-accent" />
                <Text className="text-[14.5px] font-bold text-foreground">
                  Just me
                </Text>
              </View>
              <Text className="mt-1 text-xs text-wl-text-2">Solo trip</Text>
            </GlassCard>
          </View>

          <GlassCard>
            <View className="mb-3">
              <FieldLabel>What&apos;s the vibe?</FieldLabel>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {VIBES.map((v) => (
                <Chip key={v} active={ACTIVE.includes(v)}>
                  {v}
                </Chip>
              ))}
            </View>
            <View className="mt-3.5 flex-row items-center justify-between border-t border-wl-border pt-3">
              <Text className="text-[13.5px] font-semibold text-wl-text-2">
                Daily budget
              </Text>
              <Text className="text-sm font-bold text-foreground">
                ₱2,500 · Mid-range
              </Text>
            </View>
          </GlassCard>

          <TripButton
            variant="primary"
            size="lg"
            icon={Wand2}
            full
            onPress={() => router.push("/trips/ai-generating")}
          >
            Generate my itinerary
          </TripButton>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
