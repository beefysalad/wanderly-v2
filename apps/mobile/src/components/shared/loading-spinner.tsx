import { ActivityIndicator, View } from 'react-native';

export function LoadingSpinner() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-zinc-950">
      <ActivityIndicator size="large" color="#208AEF" />
    </View>
  );
}
