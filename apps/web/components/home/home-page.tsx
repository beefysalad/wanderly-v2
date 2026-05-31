"use client"

import { AuthHeader } from "@/components/auth/auth-header"
import { HomeHero } from "@/components/home/home-hero"

export function HomePage() {
  return (
    <>
      <AuthHeader />
      <main className="bg-background text-foreground min-h-svh">
        <HomeHero />
      </main>
    </>
  )
}
