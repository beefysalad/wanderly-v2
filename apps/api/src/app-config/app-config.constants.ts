const MOBILE_STATUS_CONFIG_KEY = "mobile_status"

const DEFAULT_MOBILE_STATUS = {
  maintenanceEnabled: false,
  title: "Wanderly is under maintenance",
  message: "We are making updates to Wanderly. Please check back soon.",
} as const

export { DEFAULT_MOBILE_STATUS, MOBILE_STATUS_CONFIG_KEY }
