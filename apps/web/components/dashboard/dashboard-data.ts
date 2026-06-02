import {
  RiDashboardLine,
  RiDatabase2Line,
  RiFlashlightLine,
  RiPulseLine,
  RiSettings3Line,
  RiShieldCheckLine,
  RiUserReceived2Line,
} from "@remixicon/react"

const dashboardNavItems = [
  {
    href: "/dashboard",
    icon: RiDashboardLine,
    label: "Command center",
  },
  {
    href: "/users",
    icon: RiUserReceived2Line,
    label: "Account registry",
  },
  {
    href: "/data",
    icon: RiDatabase2Line,
    label: "System health",
  },
  {
    href: "/settings",
    icon: RiSettings3Line,
    label: "Operator settings",
  },
]

const dashboardStats = [
  {
    icon: RiShieldCheckLine,
    label: "Synced users",
    value: "1",
  },
  {
    icon: RiPulseLine,
    label: "Webhook state",
    value: "Live",
  },
  {
    icon: RiFlashlightLine,
    label: "API health",
    value: "Online",
  },
]

const dashboardActivity = [
  "Clerk user webhook received",
  "Current operator session initialized",
  "Dashboard session initialized",
]

export { dashboardActivity, dashboardNavItems, dashboardStats }
