"use client"

import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { RiArrowLeftLine, RiShieldCrossLine } from "@remixicon/react"

import { Button } from "@workspace/ui/components/button"

function AdminAccessDenied() {
  return (
    <main className="bg-background text-foreground flex min-h-svh items-center justify-center px-5 py-10">
      <section className="border-border bg-card w-full max-w-md rounded-lg border p-7 shadow-sm sm:p-8">
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="bg-destructive/10 text-destructive flex size-11 items-center justify-center rounded-lg">
              <RiShieldCrossLine className="size-5" />
            </div>
            <UserButton />
          </div>

          <div className="space-y-3">
            <p className="text-muted-foreground text-xs font-semibold tracking-normal uppercase">
              Admin access required
            </p>
            <h1 className="font-heading text-3xl font-semibold tracking-normal">
              This account is not cleared for the admin console.
            </h1>
            <p className="text-muted-foreground text-sm leading-6">
              Ask an existing admin to add the required Clerk admin claim, then
              refresh your session and try again.
            </p>
          </div>

          <Button asChild variant="outline" className="w-full">
            <Link href="/">
              <RiArrowLeftLine data-icon="inline-start" />
              Back to public page
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}

export { AdminAccessDenied }
