import { Compass } from "lucide-react-native"
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { PremiumBackground } from "@/components/shared/premium-background"
import { Icon } from "@/components/ui/icon"
import { Separator } from "@/components/ui/separator"
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
    <SafeAreaView className="flex-1 bg-slate-950" edges={["top"]}>
      <PremiumBackground />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="min-h-full px-6 pb-10 pt-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center">
            <View className="mb-10 gap-5">
              <View className="h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                <Icon as={Compass} className="text-amber-300" size={28} />
              </View>
              <View className="gap-3">
                <Text className="text-xs font-bold uppercase tracking-[0.28em] text-amber-300">
                  {eyebrow}
                </Text>
                <Text className="text-4xl font-bold leading-tight tracking-normal text-white">
                  {title}
                </Text>
                <Text className="text-base leading-relaxed text-slate-400">
                  {subtitle}
                </Text>
              </View>
            </View>

            <Separator className="mb-8 bg-white/10" />
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
