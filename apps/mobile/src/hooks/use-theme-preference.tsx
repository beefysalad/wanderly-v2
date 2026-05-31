import * as SecureStore from "expo-secure-store"
import { useColorScheme as useNativewindColorScheme } from "nativewind"
import * as React from "react"

const STORAGE_KEY = "wl-theme-preference"

export type ThemePreference = "system" | "light" | "dark"

type ThemePreferenceContextValue = {
  preference: ThemePreference
  setPreference: (preference: ThemePreference) => void
}

const ThemePreferenceContext =
  React.createContext<ThemePreferenceContextValue | null>(null)

function isThemePreference(value: string | null): value is ThemePreference {
  return value === "system" || value === "light" || value === "dark"
}

/**
 * Drives the app-wide color scheme from a user choice (System/Light/Dark),
 * persisted across launches via SecureStore and applied through NativeWind.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { setColorScheme } = useNativewindColorScheme()
  const [preference, setPref] = React.useState<ThemePreference>("system")

  React.useEffect(() => {
    let active = true
    SecureStore.getItemAsync(STORAGE_KEY)
      .then((stored) => {
        if (active && isThemePreference(stored)) {
          setPref(stored)
          setColorScheme(stored)
        }
      })
      .catch((error: unknown) => {
        console.error("Failed to load theme preference:", error)
      })
    return () => {
      active = false
    }
  }, [setColorScheme])

  const setPreference = React.useCallback(
    (next: ThemePreference) => {
      setPref(next)
      setColorScheme(next)
      void SecureStore.setItemAsync(STORAGE_KEY, next)
    },
    [setColorScheme]
  )

  const value = React.useMemo(
    () => ({ preference, setPreference }),
    [preference, setPreference]
  )

  return (
    <ThemePreferenceContext.Provider value={value}>
      {children}
    </ThemePreferenceContext.Provider>
  )
}

export function useThemePreference(): ThemePreferenceContextValue {
  const context = React.useContext(ThemePreferenceContext)
  if (!context) {
    throw new Error("useThemePreference must be used within a ThemeProvider")
  }
  return context
}
