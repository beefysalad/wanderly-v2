import { NativeTabs } from "expo-router/unstable-native-tabs"

import { useTheme } from "@/hooks/use-theme"

export default function TabsLayout() {
  const colors = useTheme()

  return (
    <NativeTabs
      backgroundColor={colors.backgroundElement}
      blurEffect="systemMaterial"
      disableTransparentOnScrollEdge
      iconColor={{ default: colors.textSecondary, selected: colors.accent }}
      indicatorColor={colors.backgroundSelected}
      labelStyle={{
        default: { color: colors.textSecondary, fontSize: 11 },
        selected: { color: colors.text, fontSize: 11, fontWeight: "600" },
      }}
      labelVisibilityMode="labeled"
      rippleColor={colors.backgroundSelected}
      shadowColor="transparent"
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Trips</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "safari", selected: "safari.fill" }}
          md={{ default: "explore", selected: "explore" }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="log">
        <NativeTabs.Trigger.Label>Log</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "map", selected: "map.fill" }}
          md={{ default: "map", selected: "map" }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="budget">
        <NativeTabs.Trigger.Label>Budget</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "wallet.pass", selected: "wallet.pass.fill" }}
          md={{
            default: "account_balance_wallet",
            selected: "account_balance_wallet",
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "person", selected: "person.fill" }}
          md={{ default: "person", selected: "person" }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  )
}
