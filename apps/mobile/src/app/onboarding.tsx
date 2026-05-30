import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import { OnboardingStepName } from '@/components/onboarding/onboarding-step-name';
import { OnboardingStepTravelStyle } from '@/components/onboarding/onboarding-step-travel-style';
import { OnboardingStepInterests } from '@/components/onboarding/onboarding-step-interests';
import { useUpdateUser } from '@/hooks/users/use-update-user';

type TravelStyle = 'BUDGET' | 'MID_RANGE' | 'LUXURY';

const STEPS = [
  { label: 'About you', emoji: '👋' },
  { label: 'Travel style', emoji: '🧳' },
  { label: 'Interests', emoji: '🌟' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { mutateAsync: updateUser, isPending } = useUpdateUser();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [travelStyle, setTravelStyle] = useState<TravelStyle | null>(null);

  function handleNameNext(value: string) {
    setName(value);
    setStep(2);
  }

  function handleStyleNext(value: TravelStyle) {
    setTravelStyle(value);
    setStep(3);
  }

  async function handleFinish(interests: string[]) {
    await updateUser({ name, travelStyle: travelStyle!, interests });
    router.replace('/(tabs)');
  }

  const currentStepInfo = STEPS[step - 1];

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">
      {/* Top progress header */}
      <LinearGradient
        colors={['#208AEF', '#0A4F8A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="px-6 pb-5 pt-4"
      >
        {/* Step pills */}
        <View className="flex-row items-center gap-2">
          {STEPS.map((s, i) => {
            const num = i + 1;
            const isDone = num < step;
            const isActive = num === step;
            return (
              <View
                key={num}
                className={[
                  'flex-row items-center gap-1.5 rounded-full px-3 py-1.5',
                  isActive
                    ? 'bg-white/25'
                    : isDone
                      ? 'bg-white/15'
                      : 'bg-white/8',
                ].join(' ')}
              >
                <View
                  className={[
                    'h-5 w-5 items-center justify-center rounded-full',
                    isActive || isDone ? 'bg-white' : 'bg-white/30',
                  ].join(' ')}
                >
                  {isDone ? (
                    <Text className="text-[10px] font-bold text-primary">✓</Text>
                  ) : (
                    <Text className="text-[10px] font-bold text-primary">{num}</Text>
                  )}
                </View>
                {isActive && (
                  <Text className="text-xs font-semibold text-white">{s.label}</Text>
                )}
              </View>
            );
          })}
        </View>

        {/* Step heading */}
        <View className="mt-4 gap-0.5">
          <Text className="text-xs font-semibold uppercase tracking-widest text-white/60">
            Step {step} of {STEPS.length}
          </Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-xl">{currentStepInfo?.emoji}</Text>
            <Text className="text-xl font-bold text-white">
              {currentStepInfo?.label}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        className="flex-1 rounded-t-[28px] bg-white dark:bg-zinc-950"
        contentContainerClassName="px-6 pt-6 pb-12"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ marginTop: -12 }}
      >
        {step === 1 && <OnboardingStepName onNext={handleNameNext} />}
        {step === 2 && <OnboardingStepTravelStyle onNext={handleStyleNext} />}
        {step === 3 && (
          <OnboardingStepInterests onFinish={handleFinish} isLoading={isPending} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
