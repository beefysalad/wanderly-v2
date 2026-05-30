import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SignUpForm } from '@/components/auth/sign-up-form';

export default function SignUpScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#0A4F8A]" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Brand hero */}
        <LinearGradient
          colors={['#208AEF', '#0A4F8A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="items-center justify-end px-6 pb-10 pt-6"
          style={{ minHeight: 200 }}
        >
          <View
            className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-white/5"
            pointerEvents="none"
          />
          <View
            className="absolute -left-12 top-4 h-32 w-32 rounded-full bg-white/5"
            pointerEvents="none"
          />

          <View className="items-center gap-2">
            <View className="mb-1 h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
              <Text className="text-3xl">🧭</Text>
            </View>
            <Text className="text-3xl font-bold tracking-tight text-white">Wanderly</Text>
            <Text className="text-sm font-medium text-white/70">
              Your next trip starts here
            </Text>
          </View>
        </LinearGradient>

        {/* Form sheet */}
        <ScrollView
          className="flex-1 rounded-t-[32px] bg-white dark:bg-zinc-950"
          contentContainerClassName="px-6 pt-8 pb-12"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={{ marginTop: -20 }}
        >
          <View className="mb-7">
            <Text className="text-2xl font-bold text-zinc-900 dark:text-white">
              Join the crew ✈️
            </Text>
            <Text className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Create your account and start planning
            </Text>
          </View>

          <SignUpForm />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
