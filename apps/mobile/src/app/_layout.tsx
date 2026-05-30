import "@/global.css"

import { ClerkLoaded, ClerkProvider } from "@clerk/expo"
import { PortalHost } from "@rn-primitives/portal"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import * as SecureStore from "expo-secure-store"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"

import { ThemeProvider } from "@/hooks/use-theme-preference"

const queryClient = new QueryClient()

const tokenCache = {
  getToken: (key: string) => SecureStore.getItemAsync(key),
  saveToken: (key: string, value: string) =>
    SecureStore.setItemAsync(key, value),
  deleteToken: (key: string) => SecureStore.deleteItemAsync(key),
}

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkLoaded>
          <ThemeProvider>
            <Stack screenOptions={{ headerShown: false }} />
            <PortalHost />
            <StatusBar style="auto" />
          </ThemeProvider>
        </ClerkLoaded>
      </QueryClientProvider>
    </ClerkProvider>
  )
}
