import { useUser } from "@clerk/expo"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { Alert, ScrollView, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useState } from "react"

import { OnboardingStepInterests } from "@/components/onboarding/onboarding-step-interests"
import { OnboardingStepTravelStyle } from "@/components/onboarding/onboarding-step-travel-style"
import { useUpdateUser } from "@/hooks/users/use-update-user"

type TravelStyle = "BUDGET" | "MID_RANGE" | "LUXURY"

const TOTAL_STEPS = 2

export default function OnboardingScreen() {
  const router = useRouter()
  const { user } = useUser()
  const { mutateAsync: updateUser, isPending } = useUpdateUser()

  const [step, setStep] = useState(1)
  const [travelStyle, setTravelStyle] = useState<TravelStyle | null>(null)

  function handleStyleNext(value: TravelStyle) {
    setTravelStyle(value)
    setStep(2)
  }

  async function handleFinish(interests: string[]) {
    try {
      await updateUser({
        // Name comes from Clerk (OAuth/signup) — no need to ask again.
        name: user?.fullName ?? undefined,
        travelStyle: travelStyle!,
        interests,
        hasCompletedOnboarding: true,
      })
      router.replace("/(tabs)")
    } catch {
      Alert.alert(
        "Onboarding failed",
        "Could not save your profile. Please try again."
      )
    }
  }

  return (
    <View className="flex-1 bg-[#0B0C10]">
      <LinearGradient
        colors={["#16131F", "rgba(11,12,16,0)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        pointerEvents="none"
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 360 }}
      />
      <SafeAreaView edges={["top", "bottom"]} className="flex-1">
        {/* Segmented progress */}
        <View className="flex-row gap-1.5 px-6 pt-5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View
              key={i}
              style={{
                backgroundColor:
                  i < step ? "#FF7A6B" : "rgba(255,255,255,0.12)",
              }}
              className="h-1 flex-1 rounded-full"
            />
          ))}
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow px-6 pb-8 pt-7"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 1 && <OnboardingStepTravelStyle onNext={handleStyleNext} />}
          {step === 2 && (
            <OnboardingStepInterests
              onFinish={handleFinish}
              isLoading={isPending}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}
