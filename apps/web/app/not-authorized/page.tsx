import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { AdminAccessDenied } from "@/components/auth/admin-access-denied"
import { hasAdminAccess } from "@/lib/auth/admin-access"

export default async function NotAuthorizedPage() {
  const { sessionClaims, userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  if (hasAdminAccess(sessionClaims)) {
    redirect("/dashboard")
  }

  return <AdminAccessDenied />
}
