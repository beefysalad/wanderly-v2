import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { onboardingNameSchema, type OnboardingNameValues } from '@/lib/validations/auth';

type Props = {
  onNext: (name: string) => void;
  isLoading?: boolean;
};

export function OnboardingStepName({ onNext, isLoading }: Props) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OnboardingNameValues>({
    resolver: zodResolver(onboardingNameSchema),
  });

  const nameValue = watch('name') ?? '';

  return (
    <View className="gap-8">
      {/* Heading */}
      <View className="gap-2">
        <Text className="text-3xl font-bold text-zinc-900 dark:text-white">
          What's your name?
        </Text>
        <Text className="text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
          This is how your travel crew will see you. Choose something they'll recognise.
        </Text>
      </View>

      {/* Name input with character preview */}
      <View className="gap-3">
        <View className="overflow-hidden rounded-2xl border-2 border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900"
          style={{
            borderColor: nameValue.length > 0 ? '#208AEF' : undefined,
          }}
        >
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="px-5 py-4 text-xl font-semibold text-zinc-900 dark:text-white"
                placeholder="Your name..."
                placeholderTextColor="#a1a1aa"
                autoCapitalize="words"
                autoComplete="name"
                textContentType="name"
                autoFocus
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                returnKeyType="done"
                onSubmitEditing={handleSubmit((v) => onNext(v.name))}
              />
            )}
          />
        </View>

        {errors.name && (
          <Text className="text-sm font-medium text-red-500">{errors.name.message}</Text>
        )}

        {/* Character preview avatar */}
        {nameValue.length > 0 && (
          <View className="flex-row items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 dark:bg-blue-900/20">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Text className="text-base font-bold text-white">
                {nameValue.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text className="text-xs font-medium text-blue-500 dark:text-blue-400">
                You'll appear as
              </Text>
              <Text className="text-sm font-bold text-zinc-900 dark:text-white">
                {nameValue}
              </Text>
            </View>
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={handleSubmit((v) => onNext(v.name))}
        disabled={isLoading || nameValue.length === 0}
        activeOpacity={0.85}
        className="items-center justify-center rounded-xl bg-primary py-4"
        style={{ opacity: nameValue.length === 0 ? 0.4 : 1 }}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-base font-bold text-white">Continue →</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
