import { useUser } from "@clerk/expo"
import { useRouter } from "expo-router"
import {
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Plane,
  Plus,
  ScanLine,
  User,
  Users,
  WalletCards,
} from "lucide-react-native"
import { Pressable, ScrollView, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { Photos, type PhotoKey, type PhotoTone } from "@/constants/theme"

import { Chip } from "../ui/chip"
import { GlassCard } from "../ui/glass-card"
import { GradientAvatar } from "../ui/gradient-avatar"
import { HeroPill } from "../ui/hero-pill"
import { Photo } from "../ui/photo"
import { ScreenGlow } from "../ui/screen-glow"
import { TripButton } from "../ui/trip-button"

type TripCard = {
  title: string
  location: string
  dates: string
  href: "/trips/detail" | "/trips/group-detail"
  mode: "Solo" | "Group"
  tone: PhotoTone
  photo?: PhotoKey
  status: string
  spend: string
  memberNames?: string[]
}

const FEATURED_TRIP: TripCard = {
  title: "Surf & Slow Mornings",
  location: "Siargao, Philippines",
  dates: "12-16 Jun · 5 days",
  href: "/trips/detail",
  mode: "Solo",
  tone: "ocean",
  photo: "siargao",
  status: "in 12 days",
  spend: "₱18.4k spent",
}

const TRIPS: TripCard[] = [
  {
    title: "Palawan Barkada",
    location: "El Nido, Palawan",
    dates: "28 Jun-3 Jul",
    href: "/trips/group-detail",
    mode: "Group",
    tone: "island",
    photo: "elnido",
    status: "6 going",
    spend: "₱62.8k shared",
    memberNames: ["Jan Cruz", "Bea Lim", "Kiko Tan"],
  },
  {
    title: "Coron Island Escape",
    location: "Coron, Palawan",
    dates: "Aug · planning",
    href: "/trips/detail",
    mode: "Solo",
    tone: "jungle",
    photo: "coron",
    status: "draft",
    spend: "Budget unset",
  },
  {
    title: "Batangas Dive Weekend",
    location: "Anilao, Batangas",
    dates: "Sep · planning",
    href: "/trips/group-detail",
    mode: "Group",
    tone: "dune",
    photo: "anilao",
    status: "4 invited",
    spend: "₱9.2k shared",
    memberNames: ["Mika Santos", "Rey Go"],
  },
]

/** Trips tab home — trip-first mixed solo/group workspace. */
function TripsHome() {
  const router = useRouter()
  const { user } = useUser()
  const firstName = user?.firstName ?? user?.fullName ?? "there"
  const fullName = user?.fullName ?? firstName

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScreenGlow />
      <View className="flex-1 px-5">
        <View className="flex-row items-center justify-between pt-3.5">
          <View>
            <Text className="text-[13.5px] font-medium text-wl-text-2">
              Hey, {firstName}
            </Text>
            <Text className="mt-px text-2xl font-extrabold tracking-tight text-foreground">
              Your Trips
            </Text>
          </View>
          <View className="flex-row gap-2.5">
            <View className="h-[42px] w-[42px] items-center justify-center rounded-[13px] border border-wl-border bg-wl-surface-2">
              <Icon as={Bell} size={20} className="text-foreground" />
            </View>
            <Pressable onPress={() => router.push("/(tabs)/profile")}>
              <GradientAvatar
                name={fullName}
                size={42}
                i={0}
                imageUrl={user?.hasImage ? user.imageUrl : undefined}
              />
            </Pressable>
          </View>
        </View>

        <View className="mb-1 mt-4 flex-row gap-2">
          <Chip active icon={Plane}>
            Planning
          </Chip>
          <Chip icon={CheckCircle2}>Completed</Chip>
          <Chip>Cancelled</Chip>
        </View>

        <ScrollView
          className="-mx-5 mt-2.5 flex-1"
          contentContainerClassName="px-5 pb-32"
          showsVerticalScrollIndicator={false}
        >
          <Pressable onPress={() => router.push(FEATURED_TRIP.href)}>
            <GlassCard className="overflow-hidden rounded-[26px] p-0">
              <Photo
                tone={FEATURED_TRIP.tone}
                src={FEATURED_TRIP.photo ? Photos[FEATURED_TRIP.photo] : null}
                scrim
                className="h-[188px]"
              >
                <View className="absolute inset-x-3.5 top-3.5 flex-row items-start justify-between">
                  <HeroPill icon={User}>Solo trip</HeroPill>
                  <HeroPill tone="aurora">{FEATURED_TRIP.status}</HeroPill>
                </View>
                <View className="absolute inset-x-4 bottom-3.5">
                  <View className="flex-row items-center gap-1.5">
                    <Icon as={MapPin} size={14} className="text-white" />
                    <Text className="text-[13px] font-semibold text-white opacity-90">
                      {FEATURED_TRIP.location}
                    </Text>
                  </View>
                  <Text className="mt-1 text-[25px] font-extrabold tracking-tight text-white">
                    {FEATURED_TRIP.title}
                  </Text>
                </View>
              </Photo>
              <View className="flex-row items-center justify-between px-4 py-3">
                <View className="flex-row items-center gap-1.5">
                  <Icon as={Calendar} size={15} className="text-wl-text-2" />
                  <Text className="text-[13.5px] font-semibold text-wl-text-2">
                    {FEATURED_TRIP.dates}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Icon
                    as={WalletCards}
                    size={15}
                    className="text-wl-text-2"
                  />
                  <Text className="text-[13.5px] font-bold text-foreground">
                    {FEATURED_TRIP.spend}
                  </Text>
                </View>
              </View>
            </GlassCard>
          </Pressable>

          <View className="mt-4 flex-row gap-2.5">
            <TripButton
              variant="primary"
              icon={Plus}
              full
              onPress={() => router.push("/trips/ai")}
              style={{ flex: 1 }}
            >
              New trip
            </TripButton>
          </View>
          <TripButton
            variant="glass"
            icon={ScanLine}
            full
            onPress={() => router.push("/trips/members")}
            className="mt-2.5"
          >
            Join trip/group
          </TripButton>

          <View className="mb-2.5 mt-5 flex-row items-center justify-between">
            <Text className="text-[14.5px] font-bold text-foreground">
              All trips
            </Text>
            <Text className="text-[12.5px] font-semibold text-wl-text-2">
              Solo and collaborative
            </Text>
          </View>

          <View className="gap-3">
            {TRIPS.map((trip) => (
              <Pressable key={trip.title} onPress={() => router.push(trip.href)}>
                <GlassCard className="flex-row items-center gap-3 rounded-[20px] p-2.5">
                  <Photo
                    tone={trip.tone}
                    src={trip.photo ? Photos[trip.photo] : null}
                    className="h-[66px] w-[66px] rounded-[15px]"
                  />
                  <View className="min-w-0 flex-1">
                    <View className="flex-row items-center gap-1.5">
                      <Text className="min-w-0 flex-1 text-[15.5px] font-bold text-foreground">
                        {trip.title}
                      </Text>
                      <View className="h-[23px] flex-row items-center gap-1 rounded-full bg-wl-accent-soft px-2">
                        <Icon
                          as={trip.mode === "Group" ? Users : User}
                          size={11}
                          className="text-wl-accent"
                        />
                        <Text className="text-[10.5px] font-bold uppercase text-wl-accent">
                          {trip.mode}
                        </Text>
                      </View>
                    </View>
                    <View className="mt-1 flex-row items-center gap-1.5">
                      <Icon as={MapPin} size={13} className="text-wl-text-2" />
                      <Text className="text-[12.5px] text-wl-text-2">
                        {trip.location} · {trip.dates}
                      </Text>
                    </View>
                    <View className="mt-1.5 flex-row items-center gap-2">
                      <Text className="text-[12px] font-semibold text-wl-text-3">
                        {trip.status}
                      </Text>
                      <Text className="text-[12px] font-semibold text-wl-text-3">
                        {trip.spend}
                      </Text>
                    </View>
                  </View>
                  {trip.memberNames ? (
                    <View className="flex-row">
                      {trip.memberNames.slice(0, 2).map((name, index) => (
                        <View
                          key={name}
                          style={{ marginLeft: index ? -10 : 0 }}
                        >
                          <GradientAvatar
                            name={name}
                            size={30}
                            i={index + 1}
                            ring
                          />
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Icon
                      as={ChevronRight}
                      size={18}
                      className="text-wl-text-3"
                    />
                  )}
                </GlassCard>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export { TripsHome }
