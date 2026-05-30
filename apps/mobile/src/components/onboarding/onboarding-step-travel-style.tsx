import { LinearGradient } from 'expo-linear-gradient';
import { Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';

type TravelStyle = 'BUDGET' | 'MID_RANGE' | 'LUXURY';

const OPTIONS: {
  value: TravelStyle;
  emoji: string;
  label: string;
  tagline: string;
  description: string;
  gradientColors: [string, string];
  textColor: string;
}[] = [
  {
    value: 'BUDGET',
    emoji: '🎒',
    label: 'Budget Explorer',
    tagline: 'Make every peso count',
    description: 'Hostels, street food, habal-habal rides',
    gradientColors: ['#FF9A3C', '#FF5722'],
    textColor: '#7C2D0E',
  },
  {
    value: 'MID_RANGE',
    emoji: '🧳',
    label: 'Comfortable Traveller',
    tagline: 'Best of both worlds',
    description: 'Hotels, sit-down meals, Grab rides',
    gradientColors: ['#208AEF', '#0A4F8A'],
    textColor: '#0A2647',
  },
  {
    value: 'LUXURY',
    emoji: '✨',
    label: 'Luxury Wanderer',
    tagline: 'No compromises',
    description: 'Resorts, fine dining, private transfers',
    gradientColors: ['#7C3AED', '#4C1D95'],
    textColor: '#1E0A47',
  },
];

type Props = {
  onNext: (style: TravelStyle) => void;
};

export function OnboardingStepTravelStyle({ onNext }: Props) {
  const [selected, setSelected] = useState<TravelStyle | null>(null);

  return (
    <View className="gap-8">
      <View className="gap-2">
        <Text className="text-3xl font-bold text-zinc-900 dark:text-white">
          How do you travel?
        </Text>
        <Text className="text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
          This shapes your AI itineraries and budget estimates.
        </Text>
      </View>

      <View className="gap-4">
        {OPTIONS.map((option) => {
          const isSelected = selected === option.value;

          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => setSelected(option.value)}
              activeOpacity={0.9}
              className="overflow-hidden rounded-2xl"
              style={{
                shadowColor: isSelected ? option.gradientColors[0] : '#000',
                shadowOffset: { width: 0, height: isSelected ? 8 : 2 },
                shadowOpacity: isSelected ? 0.3 : 0.06,
                shadowRadius: isSelected ? 16 : 4,
                elevation: isSelected ? 8 : 2,
                transform: [{ scale: isSelected ? 1.02 : 1 }],
              }}
            >
              <LinearGradient
                colors={option.gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-5"
              >
                <View className="flex-row items-start justify-between">
                  <View className="gap-1.5">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-2xl">{option.emoji}</Text>
                      <Text className="text-lg font-bold text-white">{option.label}</Text>
                    </View>
                    <Text className="text-xs font-semibold uppercase tracking-wider text-white/70">
                      {option.tagline}
                    </Text>
                    <Text className="mt-1 text-sm text-white/80">{option.description}</Text>
                  </View>

                  {isSelected && (
                    <View className="h-7 w-7 items-center justify-center rounded-full bg-white">
                      <Text className="text-xs font-bold" style={{ color: option.gradientColors[0] }}>
                        ✓
                      </Text>
                    </View>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        onPress={() => selected && onNext(selected)}
        disabled={!selected}
        activeOpacity={0.85}
        className="items-center justify-center rounded-xl bg-primary py-4"
        style={{ opacity: !selected ? 0.4 : 1 }}
      >
        <Text className="text-base font-bold text-white">Continue →</Text>
      </TouchableOpacity>
    </View>
  );
}
