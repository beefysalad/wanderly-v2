import { SignIn } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { adminAuthAppearance } from "@/components/auth/admin-auth-appearance"
import { AdminAuthFrame } from "@/components/auth/admin-auth-frame"

export default async function AdminSignInPage() {
  const { userId } = await auth()

  if (userId) {
    redirect("/dashboard")
  }

  return (
    <AdminAuthFrame
      eyebrow="Admin sign in"
      title="Run the accounts console with a verified session."
      description="Use your Wanderly admin identity to inspect synced accounts, review operational data, and manage the web console."
    >
      <SignIn
        appearance={adminAuthAppearance}
        fallbackRedirectUrl="/dashboard"
        forceRedirectUrl="/dashboard"
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
      />
    </AdminAuthFrame>
  )
}
