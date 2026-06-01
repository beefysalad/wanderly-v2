import { useUser } from "@clerk/expo"
import { useRouter } from "expo-router"
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
    <View className="flex-1 bg-background">
      <SafeAreaView edges={["top", "bottom"]} className="flex-1">
        {/* Segmented progress */}
        <View className="flex-row gap-1.5 px-6 pt-5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View
              key={i}
              className={
                i < step
                  ? "h-1 flex-1 rounded-full bg-accent"
                  : "h-1 flex-1 rounded-full bg-wl-surface-2"
              }
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
