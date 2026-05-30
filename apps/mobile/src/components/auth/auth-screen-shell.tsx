import { LinearGradient } from "expo-linear-gradient"
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { AuthLandingImageCarousel } from "@/components/auth/auth-landing-image-carousel"
import { Text } from "@/components/ui/text"

type AuthScreenShellProps = {
  children: React.ReactNode
  eyebrow: string
  subtitle: string
  title: string
}

export function AuthScreenShell({
  children,
  eyebrow,
  subtitle,
  title,
}: AuthScreenShellProps) {
  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1">
          <View className="overflow-hidden" style={{ height: "60%" }}>
            <AuthLandingImageCarousel />
            <LinearGradient
              colors={[
                "rgba(0,0,0,0.12)",
                "rgba(0,0,0,0.16)",
                "rgba(0,0,0,0.78)",
              ]}
              locations={[0, 0.42, 1]}
              style={{ position: "absolute", inset: 0 }}
            />
            <SafeAreaView
              edges={["top"]}
              className="flex-1 justify-between px-6 pb-24 pt-6"
            >
              <Text className="text-[42px] font-extrabold leading-none text-white">
                Wanderly
              </Text>

              <View className="gap-3">
                <Text className="text-xs font-bold uppercase tracking-[0.24em] text-white/70">
                  {eyebrow}
                </Text>
                <Text className="text-[35px] font-extrabold leading-[1.02] text-white">
                  {title}
                </Text>
                <Text className="max-w-[315px] text-base leading-relaxed text-white/75">
                  {subtitle}
                </Text>
              </View>
            </SafeAreaView>
          </View>

          <SafeAreaView
            edges={["bottom"]}
            className="-mt-20 flex-1 overflow-hidden bg-white"
            style={{
              borderTopLeftRadius: 42,
              borderTopRightRadius: 42,
            }}
          >
            <ScrollView
              className="flex-1"
              contentContainerClassName="grow justify-center px-7 pb-7 pt-7"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}
