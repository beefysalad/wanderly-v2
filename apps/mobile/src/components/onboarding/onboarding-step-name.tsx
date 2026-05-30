import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { UserRound } from "lucide-react-native"
import { View } from "react-native"

import {
  Avatar,
  AvatarFallback,
  AvatarFallbackText,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { Text } from "@/components/ui/text"
import {
  onboardingNameSchema,
  type OnboardingNameValues,
} from "@/lib/validations/auth"

type Props = {
  onNext: (name: string) => void
  isLoading?: boolean
}

export function OnboardingStepName({ onNext, isLoading }: Props) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OnboardingNameValues>({
    resolver: zodResolver(onboardingNameSchema),
  })

  const nameValue = watch("name") ?? ""

  return (
    <View className="gap-8">
      <View className="gap-2">
        <Text className="text-3xl font-bold text-white">What's your name?</Text>
        <Text className="text-base leading-relaxed text-slate-400">
          This is how your travel crew will see you. Choose something they'll
          recognise.
        </Text>
      </View>

      {/* Name input with character preview */}
      <View className="gap-3">
        <View
          className="overflow-hidden rounded-2xl border border-white/10 bg-slate-800/50"
          style={{
            borderColor: nameValue.length > 0 ? "#fbbf24" : undefined,
          }}
        >
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                className="border-0 bg-transparent px-5 py-4 text-xl font-semibold text-white"
                placeholder="Your name..."
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
          <Text className="text-sm font-medium text-red-500">
            {errors.name.message}
          </Text>
        )}

        {/* Character preview avatar */}
        {nameValue.length > 0 && (
          <View className="flex-row items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <Avatar alt={`${nameValue} avatar`}>
              <AvatarFallback className="bg-amber-400">
                <AvatarFallbackText className="text-slate-950">
                  {nameValue.charAt(0).toUpperCase()}
                </AvatarFallbackText>
              </AvatarFallback>
            </Avatar>
            <View>
              <Text className="text-xs font-medium text-amber-300">
                You'll appear as
              </Text>
              <Text className="text-sm font-bold text-white">{nameValue}</Text>
            </View>
          </View>
        )}

        {nameValue.length === 0 && (
          <View className="flex-row items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <Icon as={UserRound} className="text-slate-400" size={18} />
            </View>
            <View>
              <Text className="text-xs font-medium text-slate-500">
                Profile preview
              </Text>
              <Text className="text-sm font-bold text-slate-300">
                Add your name to continue
              </Text>
            </View>
          </View>
        )}
      </View>

      <Button
        onPress={handleSubmit((v) => onNext(v.name))}
        disabled={isLoading || nameValue.length === 0}
        loading={isLoading}
        size="lg"
        variant="accent"
      >
        <Text>Continue</Text>
      </Button>
    </View>
  )
}
