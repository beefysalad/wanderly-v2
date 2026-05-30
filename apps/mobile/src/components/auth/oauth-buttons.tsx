import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useSSO } from '@clerk/expo';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

type Props = {
  onError?: (err: string) => void;
};

export function OAuthButtons({ onError }: Props) {
  const { startSSOFlow } = useSSO();
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingApple, setLoadingApple] = useState(false);

  async function handleGoogle() {
    try {
      setLoadingGoogle(true);
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: Linking.createURL('/'),
      });
      if (createdSessionId && setActive) await setActive({ session: createdSessionId });
    } catch {
      onError?.('Google sign in failed. Please try again.');
    } finally {
      setLoadingGoogle(false);
    }
  }

  async function handleApple() {
    try {
      setLoadingApple(true);
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_apple',
        redirectUrl: Linking.createURL('/'),
      });
      if (createdSessionId && setActive) await setActive({ session: createdSessionId });
    } catch {
      onError?.('Apple sign in failed. Please try again.');
    } finally {
      setLoadingApple(false);
    }
  }

  return (
    <View className="gap-3">
      {/* Google */}
      <TouchableOpacity
        onPress={handleGoogle}
        disabled={loadingGoogle}
        activeOpacity={0.8}
        className="flex-row items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white py-3.5 dark:border-zinc-700 dark:bg-zinc-900"
        style={{ opacity: loadingGoogle ? 0.6 : 1 }}
      >
        {loadingGoogle ? (
          <ActivityIndicator size="small" color="#208AEF" />
        ) : (
          <>
            {/* Google G mark approximation using text */}
            <View className="h-5 w-5 items-center justify-center rounded-full bg-[#4285F4]">
              <Text className="text-[10px] font-bold text-white">G</Text>
            </View>
            <Text className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              Continue with Google
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Apple */}
      <TouchableOpacity
        onPress={handleApple}
        disabled={loadingApple}
        activeOpacity={0.85}
        className="flex-row items-center justify-center gap-3 rounded-xl bg-zinc-900 py-3.5 dark:bg-white"
        style={{ opacity: loadingApple ? 0.6 : 1 }}
      >
        {loadingApple ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <>
            <Text className="text-base font-bold text-white dark:text-zinc-900">

            </Text>
            <Text className="text-sm font-semibold text-white dark:text-zinc-900">
              Continue with Apple
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
