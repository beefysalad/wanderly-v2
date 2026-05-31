import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardUserProvider } from "@/components/dashboard/dashboard-user-provider"
import { hasAdminAccess } from "@/lib/auth/admin-access"
import { getCurrentDashboardUser } from "@/lib/auth/current-dashboard-user"

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { sessionClaims } = await auth.protect({
    unauthenticatedUrl: "/sign-in",
  })

  if (!hasAdminAccess(sessionClaims)) {
    redirect("/not-authorized")
  }

  const user = await getCurrentDashboardUser()

  return (
    <DashboardUserProvider user={user}>
      <DashboardShell>{children}</DashboardShell>
    </DashboardUserProvider>
  )
}
