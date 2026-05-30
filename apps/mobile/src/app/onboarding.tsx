import { useRouter } from "expo-router"
import { Check, Heart, Luggage, UserRound } from "lucide-react-native"
import { ScrollView, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useState } from "react"

import { OnboardingStepInterests } from "@/components/onboarding/onboarding-step-interests"
import { OnboardingStepName } from "@/components/onboarding/onboarding-step-name"
import { OnboardingStepTravelStyle } from "@/components/onboarding/onboarding-step-travel-style"
import { PremiumBackground } from "@/components/shared/premium-background"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { useUpdateUser } from "@/hooks/users/use-update-user"

type TravelStyle = "BUDGET" | "MID_RANGE" | "LUXURY"

const STEPS = [
  { label: "About you", icon: UserRound },
  { label: "Travel style", icon: Luggage },
  { label: "Interests", icon: Heart },
]

export default function OnboardingScreen() {
  const router = useRouter()
  const { mutateAsync: updateUser, isPending } = useUpdateUser()

  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [travelStyle, setTravelStyle] = useState<TravelStyle | null>(null)

  function handleNameNext(value: string) {
    setName(value)
    setStep(2)
  }

  function handleStyleNext(value: TravelStyle) {
    setTravelStyle(value)
    setStep(3)
  }

  async function handleFinish(interests: string[]) {
    await updateUser({
      name,
      travelStyle: travelStyle!,
      interests,
      hasCompletedOnboarding: true,
    })
    router.replace("/(tabs)")
  }

  const currentStepInfo = STEPS[step - 1]
  const CurrentStepIcon = currentStepInfo?.icon

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <PremiumBackground variant="orange" />
      <View className="px-6 pt-4 pb-5">
        {/* Step pills */}
        <View className="flex-row items-center gap-2">
          {STEPS.map((s, i) => {
            const num = i + 1
            const isDone = num < step
            const isActive = num === step
            const StepIcon = s.icon
            return (
              <View
                key={num}
                className={[
                  "flex-row items-center gap-1.5 rounded-full border px-3 py-1.5",
                  isActive
                    ? "border-amber-400/40 bg-amber-400/15"
                    : isDone
                      ? "border-white/10 bg-white/10"
                      : "border-white/5 bg-white/5",
                ].join(" ")}
              >
                <View
                  className={[
                    "h-5 w-5 items-center justify-center rounded-full",
                    isActive || isDone ? "bg-amber-300" : "bg-white/10",
                  ].join(" ")}
                >
                  {isDone ? (
                    <Icon as={Check} className="text-slate-950" size={12} />
                  ) : (
                    <Icon
                      as={StepIcon}
                      className={isActive ? "text-slate-950" : "text-slate-400"}
                      size={11}
                    />
                  )}
                </View>
                {isActive && (
                  <Text className="text-xs font-semibold text-white">
                    {s.label}
                  </Text>
                )}
              </View>
            )
          })}
        </View>

        {/* Step heading */}
        <View className="mt-6 gap-2">
          <Text className="text-xs font-bold tracking-[0.25em] text-amber-300 uppercase">
            Step {step} of {STEPS.length}
          </Text>
          <View className="flex-row items-center gap-2">
            {CurrentStepIcon && (
              <Icon as={CurrentStepIcon} className="text-white" size={22} />
            )}
            <Text className="text-xl font-bold text-white">
              {currentStepInfo?.label}
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-12 pt-2"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
          {step === 1 && <OnboardingStepName onNext={handleNameNext} />}
          {step === 2 && <OnboardingStepTravelStyle onNext={handleStyleNext} />}
          {step === 3 && (
            <OnboardingStepInterests
              onFinish={handleFinish}
              isLoading={isPending}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
