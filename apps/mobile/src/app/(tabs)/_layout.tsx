import { Tabs } from "expo-router"

import { TripTabBar } from "@/components/trips/trip-tab-bar"

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TripTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: "Trips" }} />
      <Tabs.Screen name="log" options={{ title: "Log" }} />
      <Tabs.Screen name="budget" options={{ title: "Budget" }} />
      <Tabs.Screen name="profile" options={{ title: "You" }} />
    </Tabs>
  )
}
