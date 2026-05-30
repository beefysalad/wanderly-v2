import { Tabs } from "expo-router/js-tabs"

import { TripTabBar } from "@/components/trips/trip-tab-bar"

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TripTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="log" />
      <Tabs.Screen name="budget" />
      <Tabs.Screen name="profile" />
    </Tabs>
  )
}
