import { SignUp } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { adminAuthAppearance } from "@/components/auth/admin-auth-appearance"
import { AdminAuthFrame } from "@/components/auth/admin-auth-frame"

export default async function AdminSignUpPage() {
  const { userId } = await auth()

  if (userId) {
    redirect("/dashboard")
  }

  return (
    <AdminAuthFrame
      eyebrow="Admin sign up"
      title="Create an admin identity before entering operations."
      description="New accounts still need admin claims before backend admin APIs will return operational data."
    >
      <SignUp
        appearance={adminAuthAppearance}
        fallbackRedirectUrl="/dashboard"
        forceRedirectUrl="/dashboard"
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
      />
    </AdminAuthFrame>
  )
}
