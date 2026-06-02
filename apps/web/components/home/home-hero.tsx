"use client"

import {
  RiArrowRightLine,
  RiDatabase2Line,
  RiShieldCheckLine,
  RiUser3Line,
} from "@remixicon/react"
import Link from "next/link"

import { Button } from "@workspace/ui/components/button"

const OPERATIONS = [
  {
    icon: RiUser3Line,
    label: "Registry",
    value: "Synced accounts",
  },
  {
    icon: RiShieldCheckLine,
    label: "OAuth",
    value: "Google + Apple",
  },
  {
    icon: RiDatabase2Line,
    label: "Health",
    value: "Backend checks",
  },
]

export function HomeHero() {
  return (
    <section className="bg-background border-border flex min-h-svh items-center border-b px-6 pt-20">
      <div className="mx-auto grid w-full max-w-6xl gap-12 py-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.72fr)] lg:items-center">
        <div className="max-w-2xl space-y-8">
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm font-medium">
              Wanderly Ops
            </p>
            <h1 className="font-heading text-balance text-5xl font-semibold leading-none tracking-normal sm:text-6xl">
              Operate the accounts behind every trip.
            </h1>
            <p className="text-muted-foreground max-w-xl text-base leading-7">
              Review traveler accounts, catch onboarding gaps, verify OAuth
              linkage, and keep the backend identity layer visible while the
              mobile app grows.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-11 rounded-lg px-5">
              <Link href="/sign-in">
                Sign in
                <RiArrowRightLine data-icon="inline-end" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 rounded-lg px-5"
            >
              <Link href="/sign-up">Request console access</Link>
            </Button>
          </div>
        </div>

        <div className="border-border bg-card overflow-hidden rounded-lg border shadow-sm">
          <div className="border-border flex items-center justify-between border-b px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Admin console</p>
              <p className="text-muted-foreground text-xs">
                Wanderly account operations
              </p>
            </div>
            <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              Ready
            </span>
          </div>

          <div className="divide-border divide-y">
            {OPERATIONS.map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-4 px-4 py-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-lg">
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {item.label}
                      </span>
                      <span className="text-muted-foreground block truncate text-xs">
                        {item.value}
                      </span>
                    </span>
                  </div>
                  <span className="bg-muted size-2 rounded-full" />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
