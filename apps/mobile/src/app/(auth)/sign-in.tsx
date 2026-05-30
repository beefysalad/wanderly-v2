import { AuthScreenShell } from "@/components/auth/auth-screen-shell"
import { SignInForm } from "@/components/auth/sign-in-form"

export default function SignInScreen() {
  return (
    <AuthScreenShell
      eyebrow="Wanderly"
      title="Welcome back"
      subtitle="Sign in to continue planning the smarter way to travel with your crew."
    >
      <SignInForm />
    </AuthScreenShell>
  )
}
