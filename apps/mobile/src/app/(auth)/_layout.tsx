import { useAuth } from '@clerk/expo';
import { Redirect, Stack } from 'expo-router';

import { LoadingSpinner } from '@/components/shared/loading-spinner';

export default function AuthLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <LoadingSpinner />;
  if (isSignedIn) return <Redirect href="/" />;

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
