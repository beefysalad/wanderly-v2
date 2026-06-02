import type { ReactNode } from "react"
import { useEffect } from "react"
import { AppState } from "react-native"

import { MaintenanceScreen } from "@/components/maintenance/maintenance-screen"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { useMobileStatus } from "@/hooks/app-config/use-mobile-status"

type MaintenanceGateProps = {
  children: ReactNode
}

function MaintenanceGate({ children }: MaintenanceGateProps) {
  const { data, isError, isPending, isRefetching, refetch } = useMobileStatus()

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        void refetch()
      }
    })

    return () => {
      subscription.remove()
    }
  }, [refetch])

  if (isPending) {
    return <LoadingSpinner />
  }

  if (!isError && data?.maintenanceEnabled) {
    return (
      <MaintenanceScreen
        title={data.title}
        message={data.message}
        updatedAt={data.updatedAt}
        isRefreshing={isRefetching}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  return <>{children}</>
}

export { MaintenanceGate }
export type { MaintenanceGateProps }
