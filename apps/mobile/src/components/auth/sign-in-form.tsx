import { useSignIn } from '@clerk/expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useState } from 'react';

import { signInSchema, type SignInValues } from '@/lib/validations/auth';
import { OAuthButtons } from '@/components/auth/oauth-buttons';

export function SignInForm() {
  const { signIn } = useSignIn();
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
  });

  async function onSubmit(values: SignInValues) {
    setServerError('');
    try {
      const r1 = await signIn.create({ identifier: values.email });
      if (r1.error) throw r1.error;
      const r2 = await signIn.password({ password: values.password });
      if (r2.error) throw r2.error;
      const r3 = await signIn.finalize();
      if (r3.error) throw r3.error;
    } catch (err: unknown) {
      const e = err as { message?: string; longMessage?: string } | null;
      setServerError(e?.longMessage ?? e?.message ?? 'Sign in failed. Try again.');
    }
  }

  return (
    <View className="gap-5">
      {/* Email */}
      <View className="gap-2">
        <Text className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Email address
        </Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-base text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
              placeholder="you@example.com"
              placeholderTextColor="#a1a1aa"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.email && (
          <Text className="text-xs font-medium text-red-500">{errors.email.message}</Text>
        )}
      </View>

      {/* Password */}
      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Password
          </Text>
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
            <Text className="text-sm font-medium text-primary">
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-base text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
              placeholder="Your password"
              placeholderTextColor="#a1a1aa"
              secureTextEntry={!showPassword}
              autoComplete="password"
              textContentType="password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.password && (
          <Text className="text-xs font-medium text-red-500">{errors.password.message}</Text>
        )}
      </View>

      {/* Server error */}
      {serverError ? (
        <View className="rounded-xl bg-red-50 px-4 py-3 dark:bg-red-900/20">
          <Text className="text-sm text-red-600 dark:text-red-400">{serverError}</Text>
        </View>
      ) : null}

      {/* Sign in button */}
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        className="items-center justify-center rounded-xl bg-primary py-4"
        activeOpacity={0.85}
        style={{ opacity: isSubmitting ? 0.7 : 1 }}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-base font-bold text-white">Sign In</Text>
        )}
      </TouchableOpacity>

      {/* Divider */}
      <View className="flex-row items-center gap-4">
        <View className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        <Text className="text-xs font-medium uppercase tracking-wider text-zinc-400">
          or continue with
        </Text>
        <View className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      </View>

      <OAuthButtons onError={setServerError} />

      {/* Sign up link */}
      <View className="flex-row items-center justify-center gap-1 pt-2">
        <Text className="text-sm text-zinc-500 dark:text-zinc-400">
          New to Wanderly?
        </Text>
        <TouchableOpacity onPress={() => router.replace('/(auth)/sign-up')} hitSlop={8}>
          <Text className="text-sm font-bold text-primary">Create an account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
