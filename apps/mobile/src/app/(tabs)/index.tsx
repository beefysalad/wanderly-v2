import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Placeholder — WND-9 will build this out properly
export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">
      <View className="flex-1 items-center justify-center gap-3">
        <Text className="text-4xl">🧭</Text>
        <Text className="text-xl font-bold text-zinc-900 dark:text-white">
          Wanderly
        </Text>
        <Text className="text-sm text-zinc-500 dark:text-zinc-400">
          Home screen coming in WND-9
        </Text>
      </View>
    </SafeAreaView>
  );
}
