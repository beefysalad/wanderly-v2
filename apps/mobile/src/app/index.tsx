import { useAuth } from "@clerk/expo"
import { Redirect } from "expo-router"

import { useCurrentUser } from "@/hooks/users/use-current-user"
import { LoadingSpinner } from "@/components/shared/loading-spinner"

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth()
  const { data: user, isPending } = useCurrentUser({
    enabled: isLoaded && !!isSignedIn,
  })

  if (!isLoaded || (isSignedIn && isPending)) {
    return <LoadingSpinner />
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/welcome" />
  }

  if (!user?.hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />
  }

  return <Redirect href="/(tabs)" />
}
