import { useSignUp } from '@clerk/expo';
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

import { signUpSchema, type SignUpValues } from '@/lib/validations/auth';
import { OAuthButtons } from '@/components/auth/oauth-buttons';

export function SignUpForm() {
  const { signUp } = useSignUp();
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifying, setVerifying] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
  });

  async function onSubmit(values: SignUpValues) {
    setServerError('');
    try {
      const r = await signUp.create({ emailAddress: values.email, password: values.password });
      if (r.error) throw r.error;
      setPendingVerification(true);
    } catch (err: unknown) {
      const e = err as { message?: string; longMessage?: string } | null;
      setServerError(e?.longMessage ?? e?.message ?? 'Sign up failed. Try again.');
    }
  }

  async function onVerify() {
    setVerifying(true);
    setServerError('');
    try {
      const r = await signUp.verifications.verifyEmailCode({ code: verifyCode });
      if (r.error) throw r.error;
      const fin = await signUp.finalize();
      if (fin.error) throw fin.error;
    } catch (err: unknown) {
      const e = err as { message?: string; longMessage?: string } | null;
      setServerError(e?.longMessage ?? e?.message ?? 'Invalid code. Try again.');
    } finally {
      setVerifying(false);
    }
  }

  if (pendingVerification) {
    return (
      <View className="gap-5">
        {/* Email icon + instructions */}
        <View className="items-center gap-3 rounded-2xl bg-blue-50 px-6 py-6 dark:bg-blue-900/20">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Text className="text-2xl">📬</Text>
          </View>
          <View className="items-center gap-1">
            <Text className="text-base font-bold text-zinc-900 dark:text-white">
              Check your email
            </Text>
            <Text className="text-center text-sm text-zinc-500 dark:text-zinc-400">
              We sent a 6-digit verification code to your email address.
            </Text>
          </View>
        </View>

        {/* Code input */}
        <View className="gap-2">
          <Text className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Verification code
          </Text>
          <TextInput
            className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-center text-2xl font-bold tracking-[0.4em] text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
            placeholder="000000"
            placeholderTextColor="#a1a1aa"
            keyboardType="number-pad"
            maxLength={6}
            value={verifyCode}
            onChangeText={setVerifyCode}
          />
        </View>

        {serverError ? (
          <View className="rounded-xl bg-red-50 px-4 py-3 dark:bg-red-900/20">
            <Text className="text-sm text-red-600 dark:text-red-400">{serverError}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          onPress={onVerify}
          disabled={verifying || verifyCode.length < 6}
          className="items-center justify-center rounded-xl bg-primary py-4"
          activeOpacity={0.85}
          style={{ opacity: verifyCode.length < 6 ? 0.5 : 1 }}
        >
          {verifying ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-base font-bold text-white">Verify & Continue</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setPendingVerification(false)}
          className="items-center py-2"
          hitSlop={8}
        >
          <Text className="text-sm text-zinc-500 dark:text-zinc-400">← Use a different email</Text>
        </TouchableOpacity>
      </View>
    );
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
              placeholder="Min. 8 characters"
              placeholderTextColor="#a1a1aa"
              secureTextEntry={!showPassword}
              autoComplete="new-password"
              textContentType="newPassword"
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

      {serverError ? (
        <View className="rounded-xl bg-red-50 px-4 py-3 dark:bg-red-900/20">
          <Text className="text-sm text-red-600 dark:text-red-400">{serverError}</Text>
        </View>
      ) : null}

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
          <Text className="text-base font-bold text-white">Create Account</Text>
        )}
      </TouchableOpacity>

      <View className="flex-row items-center gap-4">
        <View className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        <Text className="text-xs font-medium uppercase tracking-wider text-zinc-400">
          or continue with
        </Text>
        <View className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      </View>

      <OAuthButtons onError={setServerError} />

      <View className="flex-row items-center justify-center gap-1 pt-2">
        <Text className="text-sm text-zinc-500 dark:text-zinc-400">
          Already have an account?
        </Text>
        <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')} hitSlop={8}>
          <Text className="text-sm font-bold text-primary">Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
