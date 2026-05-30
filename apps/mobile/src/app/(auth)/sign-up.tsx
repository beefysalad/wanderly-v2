import { AuthScreenShell } from "@/components/auth/auth-screen-shell"
import { SignUpForm } from "@/components/auth/sign-up-form"

export default function SignUpScreen() {
  return (
    <AuthScreenShell
      eyebrow="Join the journey"
      title="Create account"
      subtitle="Start collaborating with friends and build the perfect itinerary together."
    >
      <SignUpForm />
    </AuthScreenShell>
  )
}
