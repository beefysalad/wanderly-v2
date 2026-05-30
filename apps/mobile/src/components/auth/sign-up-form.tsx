import { useAuth, useSignUp } from "@clerk/expo"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "expo-router"
import { MailCheck } from "lucide-react-native"
import { Controller, useForm } from "react-hook-form"
import { TouchableOpacity, View } from "react-native"
import { useState } from "react"

import { OAuthButtons } from "@/components/auth/oauth-buttons"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Text } from "@/components/ui/text"
import { signUpSchema, type SignUpValues } from "@/lib/validations/auth"

export function SignUpForm() {
  const { isLoaded } = useAuth()
  const { signUp } = useSignUp()
  const router = useRouter()
  const [serverError, setServerError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [pendingVerification, setPendingVerification] = useState(false)
  const [verifyCode, setVerifyCode] = useState("")
  const [verifying, setVerifying] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: SignUpValues) {
    setServerError("")
    try {
      if (!isLoaded || !signUp) {
        setServerError("Auth is still loading. Try again.")
        return
      }

      const createResult = await signUp.create({
        emailAddress: values.email,
        password: values.password,
      })

      if (createResult.error) {
        throw createResult.error
      }

      const codeResult = await signUp.verifications.sendEmailCode()

      if (codeResult.error) {
        throw codeResult.error
      }

      setPendingVerification(true)
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
          "Sign up failed. Try again."
      )
    }
  }

  async function onVerify() {
    setVerifying(true)
    setServerError("")
    try {
      if (!isLoaded || !signUp) {
        setServerError("Auth is still loading. Try again.")
        return
      }

      const verifyResult = await signUp.verifications.verifyEmailCode({
        code: verifyCode,
      })

      if (verifyResult.error) {
        throw verifyResult.error
      }

      if (signUp.status !== "complete") {
        setServerError("Verification incomplete. Additional steps required.")
        return
      }

      const finalizeResult = await signUp.finalize()

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
          "Invalid code. Try again."
      )
    } finally {
      setVerifying(false)
    }
  }

  if (pendingVerification) {
    return (
      <View className="gap-5">
        {/* Email icon + instructions */}
        <View className="items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-6">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-amber-400/10">
            <Icon as={MailCheck} className="text-amber-300" size={26} />
          </View>
          <View className="items-center gap-1">
            <Text className="text-base font-bold text-white">
              Check your email
            </Text>
            <Text className="text-center text-sm text-slate-400">
              We sent a 6-digit verification code to your email address.
            </Text>
          </View>
        </View>

        {/* Code input */}
        <View className="gap-2">
          <Text className="text-xs font-bold tracking-wider text-slate-400 uppercase">
            Verification code
          </Text>
          <Input
            className="px-4 py-4 text-center text-2xl font-bold tracking-[0.4em]"
            placeholder="000000"
            keyboardType="number-pad"
            maxLength={6}
            value={verifyCode}
            onChangeText={setVerifyCode}
          />
        </View>

        {serverError ? (
          <View className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
            <Text className="text-sm font-medium text-red-300">
              {serverError}
            </Text>
          </View>
        ) : null}

        <Button
          onPress={onVerify}
          disabled={!isLoaded || verifying || verifyCode.length < 6}
          loading={verifying}
          size="lg"
          variant="accent"
        >
          <Text>Verify & Continue</Text>
        </Button>

        <TouchableOpacity
          onPress={() => setPendingVerification(false)}
          className="items-center py-2"
          hitSlop={8}
        >
          <Text className="text-sm font-medium text-slate-400">
            Use a different email
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View className="gap-5">
      {/* Email */}
      <View className="gap-2">
        <Text className="text-xs font-bold text-slate-400 uppercase">
          Email address
        </Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
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
          <Text className="text-xs font-medium text-red-500">
            {errors.email.message}
          </Text>
        )}
      </View>

      {/* Password */}
      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-bold tracking-wider text-slate-400 uppercase">
            Password
          </Text>
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={8}
          >
            <Text className="text-sm font-semibold text-amber-300">
              {showPassword ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        </View>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Min. 8 characters"
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
          <Text className="text-xs font-medium text-red-500">
            {errors.password.message}
          </Text>
        )}
      </View>

      {serverError ? (
        <View className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
          <Text className="text-sm font-medium text-red-300">
            {serverError}
          </Text>
        </View>
      ) : null}

      <Button
        onPress={handleSubmit(onSubmit)}
        disabled={!isLoaded}
        loading={isSubmitting}
        size="lg"
        variant="accent"
      >
        <Text>Create Account</Text>
      </Button>

      <View className="flex-row items-center gap-4">
        <Separator className="flex-1" />
        <Text className="text-xs font-medium tracking-wider text-slate-500 uppercase">
          or continue with
        </Text>
        <Separator className="flex-1" />
      </View>

      <OAuthButtons onError={setServerError} />

      <View className="flex-row items-center justify-center gap-1 pt-2">
        <Text className="text-sm text-slate-400">Already have an account?</Text>
        <TouchableOpacity
          onPress={() => router.replace("/(auth)/sign-in")}
          hitSlop={8}
        >
          <Text className="text-sm font-bold text-amber-300">Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
