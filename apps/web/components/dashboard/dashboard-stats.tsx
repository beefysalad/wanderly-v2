"use client"

import {
  RiCheckboxCircleLine,
  RiKey2Line,
  RiUserReceived2Line,
} from "@remixicon/react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"

import { useAdminUsers } from "@/hooks/api/use-admin-users"

export function DashboardStats() {
  const { data, isPending } = useAdminUsers()
  const users = data?.users ?? []
  const onboardedUsers = users.filter(
    (user) => user.hasCompletedOnboarding
  ).length
  const pendingUsers = users.length - onboardedUsers
  const oauthLinkedUsers = users.filter(
    (user) => user.authProviders.length > 0
  ).length
  const onboardingRate =
    users.length > 0 ? Math.round((onboardedUsers / users.length) * 100) : 0

  const dashboardStats = [
    {
      icon: RiUserReceived2Line,
      label: "Account registry",
      value: users.length.toString(),
      detail: "Total synced Clerk users",
    },
    {
      icon: RiCheckboxCircleLine,
      label: "Onboarding health",
      value: `${onboardingRate}%`,
      detail: `${onboardedUsers} complete / ${pendingUsers} pending`,
    },
    {
      icon: RiKey2Line,
      label: "OAuth linked",
      value: oauthLinkedUsers.toString(),
      detail: "Accounts linked to Google or Apple",
    },
  ]

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {dashboardStats.map((stat) => {
        const Icon = stat.icon

        return (
          <Card key={stat.label} className="rounded-lg shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground flex items-center gap-2 text-xs font-medium uppercase tracking-normal">
                <Icon className="size-3.5" />
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {isPending ? (
                  <Skeleton className="h-9 w-16" />
                ) : (
                  <p className="text-3xl font-semibold tracking-normal">
                    {stat.value}
                  </p>
                )}
                <p className="text-muted-foreground text-xs">{stat.detail}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </section>
  )
}
