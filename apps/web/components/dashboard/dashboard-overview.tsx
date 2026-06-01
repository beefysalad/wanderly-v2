"use client"

import { RiArrowRightLine } from "@remixicon/react"
import Link from "next/link"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { useDashboardUser } from "@/components/dashboard/dashboard-user-provider"
import { RecentUsersCard } from "@/components/dashboard/recent-users-card"

function DashboardOverview() {
  const user = useDashboardUser()

  const getGreeting = (): string => {
    const hour = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })
    ).getHours()

    if (hour >= 5 && hour < 12) return "Good morning"
    if (hour >= 12 && hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <section className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">Overview</p>
          <h1 className="font-heading text-3xl font-semibold tracking-normal md:text-4xl">
            {getGreeting()}, {user.name.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground text-sm">
            Admin console status:{" "}
            <span className="font-medium text-green-600 dark:text-green-400">
              Account tools online
            </span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="sm" className="w-full sm:w-auto">
            <Link href="/users">
              Open accounts
              <RiArrowRightLine data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </section>

      <DashboardStats />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Card className="rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle>Admin workspace</CardTitle>
            <CardDescription>
              Start with account inspection. More operational tools can attach
              here as the backend admin surface grows.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="border-border rounded-lg border p-4">
              <p className="font-medium">Primary workflow</p>
              <p className="text-muted-foreground mt-1 text-sm leading-5">
                Review users, open a profile, and toggle onboarding state for
                testing mobile flows.
              </p>
            </div>
            <div className="border-border rounded-lg border p-4">
              <p className="font-medium">API boundary</p>
              <p className="text-muted-foreground mt-1 text-sm leading-5">
                Admin reads and writes now live under the `/admin` backend
                prefix.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="min-w-0">
          <RecentUsersCard />
        </div>
      </div>
    </main>
  )
}

export { DashboardOverview }
