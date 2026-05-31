"use client"

import { Show, UserButton } from "@clerk/nextjs"

import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

function AuthHeader() {
  const pathname = usePathname()

  if (pathname.startsWith("/dashboard")) {
    return null
  }

  return (
    <header className="border-border bg-background/80 fixed inset-x-0 top-0 z-50 border-b px-6 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="text-sm font-semibold tracking-normal">
          Wanderly Admin
        </Link>
        <div className="flex items-center gap-2">
          <Show when="signed-out">
            <Button asChild variant="ghost" size="sm">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </Show>
          <Show when="signed-in">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  )
}

export { AuthHeader }
