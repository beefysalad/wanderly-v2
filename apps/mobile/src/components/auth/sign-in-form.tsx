import { useAuth, useSignIn } from "@clerk/expo"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "expo-router"
import { Controller, useForm } from "react-hook-form"
import { TouchableOpacity, View } from "react-native"
import { useState } from "react"

import { OAuthButtons } from "@/components/auth/oauth-buttons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Text } from "@/components/ui/text"
import { signInSchema, type SignInValues } from "@/lib/validations/auth"

export function SignInForm() {
  const { isLoaded } = useAuth()
  const { signIn } = useSignIn()
  const router = useRouter()
  const [serverError, setServerError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: SignInValues) {
    setServerError("")
    try {
      if (!isLoaded || !signIn) {
        setServerError("Auth is still loading. Try again.")
        return
      }

      const createResult = await signIn.create({
        identifier: values.email,
        password: values.password,
      })

      if (createResult.error) {
        throw createResult.error
      }

      if (signIn.status !== "complete") {
        setServerError("Sign in incomplete. Additional steps required.")
        return
      }

      const finalizeResult = await signIn.finalize()

      if (finalizeResult.error) {
        throw finalizeResult.error
      }

      router.replace("/")
    } catch (err: unknown) {
      const e = err as {
        errors?: { message?: string; longMessage?: string }[]
        message?: string
        longMessage?: string
      } | null
      const firstError = e?.errors?.[0]
      setServerError(
        firstError?.longMessage ??
          firstError?.message ??
          e?.longMessage ??
          e?.message ??
          "Sign in failed. Try again."
      )
    }
  }

  return (
    <View className="gap-5">
      {/* Email */}
      <View className="gap-2">
        <Text className="text-xs font-bold uppercase text-neutral-500">
          Email address
        </Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="border-neutral-200 bg-neutral-50 text-black"
              placeholder="you@example.com"
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
          <Text className="text-xs font-medium text-red-600">
            {errors.email.message}
          </Text>
        )}
      </View>

      {/* Password */}
      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Password
          </Text>
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={8}
          >
            <Text className="text-sm font-semibold text-black">
              {showPassword ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        </View>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="border-neutral-200 bg-neutral-50 text-black"
              placeholder="Your password"
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
          <Text className="text-xs font-medium text-red-600">
            {errors.password.message}
          </Text>
        )}
      </View>

      {/* Server error */}
      {serverError ? (
        <View className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <Text className="text-sm font-medium text-red-700">
            {serverError}
          </Text>
        </View>
      ) : null}

      {/* Sign in button */}
      <Button
        onPress={handleSubmit(onSubmit)}
        disabled={!isLoaded}
        loading={isSubmitting}
        loadingColor="#FFFFFF"
        className="rounded-full bg-black"
        size="lg"
        variant="accent"
      >
        <Text className="text-white">Sign In</Text>
      </Button>

      <OAuthButtons onError={setServerError} />

      {/* Sign up link */}
      <View className="flex-row items-center justify-center gap-1 pt-2">
        <Text className="text-sm text-neutral-500">New to Wanderly?</Text>
        <TouchableOpacity
          onPress={() => router.replace("/(auth)/sign-up")}
          hitSlop={8}
        >
          <Text className="text-sm font-bold text-black">
            Create an account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
