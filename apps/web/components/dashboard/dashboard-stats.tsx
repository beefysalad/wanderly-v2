"use client"

import {
  RiCheckboxCircleLine,
  RiTimeLine,
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

  const dashboardStats = [
    {
      icon: RiUserReceived2Line,
      label: "Synced accounts",
      value: users.length.toString(),
      detail: "Total user records",
    },
    {
      icon: RiCheckboxCircleLine,
      label: "Onboarded",
      value: onboardedUsers.toString(),
      detail: "Completed mobile setup",
    },
    {
      icon: RiTimeLine,
      label: "Pending",
      value: pendingUsers.toString(),
      detail: "Still in onboarding",
    },
  ]

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {dashboardStats.map((stat) => {
        const Icon = stat.icon

        return (
          <Card key={stat.label} className="rounded-lg shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-normal uppercase">
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
