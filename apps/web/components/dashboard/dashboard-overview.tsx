"use client"

import type { AdminUser } from "@workspace/shared"
import {
  RiArrowRightLine,
  RiCheckboxCircleLine,
  RiKey2Line,
  RiPulseLine,
  RiShieldCheckLine,
  RiTimeLine,
  RiErrorWarningLine,
} from "@remixicon/react"
import Link from "next/link"
import { useMemo } from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import { Skeleton } from "@workspace/ui/components/skeleton"

import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { useDashboardUser } from "@/components/dashboard/dashboard-user-provider"
import { RecentUsersCard } from "@/components/dashboard/recent-users-card"
import { AuthProviderBadges } from "@/components/users/auth-provider-badges"
import { useAdminUsers } from "@/hooks/api/use-admin-users"
import { useApiHealth } from "@/hooks/api/use-api-health"

function DashboardOverview() {
  const operator = useDashboardUser()
  const {
    data,
    isPending: isUsersPending,
    isError: isUsersError,
  } = useAdminUsers()
  const {
    data: health,
    isPending: isHealthPending,
    isError: isHealthError,
  } = useApiHealth()

  const users = useMemo(() => data?.users ?? [], [data?.users])
  const pendingOnboardingUsers = users
    .filter((user) => !user.hasCompletedOnboarding)
    .slice(0, 5)
  const googleUsers = users.filter((user) =>
    user.authProviders.includes("GOOGLE")
  ).length
  const appleUsers = users.filter((user) =>
    user.authProviders.includes("APPLE")
  ).length
  const noOauthUsers = users.filter(
    (user) => user.authProviders.length === 0
  ).length
  const accountsNeedingAttention = users.filter(
    (user) => !user.hasCompletedOnboarding || user.authProviders.length === 0
  ).length
  const apiOnline = !isHealthError && health?.status === "ok"
  const apiStatusLabel = isHealthPending
    ? "Checking"
    : apiOnline
      ? "Online"
      : "Needs attention"

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-end">
        <div className="space-y-4">
          <Badge variant="secondary" className="h-7 w-fit px-3">
            <RiShieldCheckLine data-icon="inline-start" />
            Admin gated
          </Badge>
          <div className="max-w-3xl space-y-2">
            <p className="text-muted-foreground text-sm">
              Good {getDayPart()}, {operator.name.split(" ")[0]}
            </p>
            <h1 className="font-heading text-3xl font-semibold leading-tight tracking-normal md:text-5xl">
              Wanderly operations command center
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm leading-6">
              Monitor account sync, onboarding completion, OAuth linkage, and
              backend health before issues leak into the mobile travel flow.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row xl:justify-end">
          <Button asChild className="sm:w-auto">
            <Link href="/users">
              Review accounts
              <RiArrowRightLine data-icon="inline-end" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="sm:w-auto">
            <Link href="/data">System health</Link>
          </Button>
        </div>
      </section>

      <DashboardStats />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid min-w-0 gap-6">
          <Card className="rounded-lg shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>Onboarding queue</CardTitle>
                  <CardDescription>
                    Accounts that still need mobile setup attention.
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    pendingOnboardingUsers.length > 0 ? "outline" : "secondary"
                  }
                  className="mt-0.5"
                >
                  {pendingOnboardingUsers.length} pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {isUsersPending ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, index) => (
                    <Skeleton key={index} className="h-14 rounded-lg" />
                  ))}
                </div>
              ) : isUsersError ? (
                <EmptyPanel
                  icon={<RiErrorWarningLine className="size-5" />}
                  title="Account registry unavailable"
                  body="The admin users endpoint did not return account data."
                />
              ) : pendingOnboardingUsers.length === 0 ? (
                <EmptyPanel
                  icon={<RiCheckboxCircleLine className="size-5" />}
                  title="No onboarding backlog"
                  body="Every synced account is marked as onboarded."
                />
              ) : (
                <div className="space-y-3">
                  {pendingOnboardingUsers.map((user) => (
                    <AccountQueueRow key={user.id} user={user} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="rounded-lg shadow-sm">
              <CardHeader>
                <CardTitle>Auth provider mix</CardTitle>
                <CardDescription>
                  Google and Apple linkage across synced accounts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isUsersPending ? (
                  <>
                    <Skeleton className="h-12 rounded-lg" />
                    <Skeleton className="h-12 rounded-lg" />
                    <Skeleton className="h-12 rounded-lg" />
                  </>
                ) : (
                  <>
                    <ProviderMeter
                      label="Google"
                      value={googleUsers}
                      total={users.length}
                    />
                    <ProviderMeter
                      label="Apple"
                      value={appleUsers}
                      total={users.length}
                    />
                    <ProviderMeter
                      label="No OAuth"
                      value={noOauthUsers}
                      total={users.length}
                    />
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-lg shadow-sm">
              <CardHeader>
                <CardTitle>System watch</CardTitle>
                <CardDescription>
                  Live status for admin-facing backend surfaces.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <StatusLine
                  icon={<RiPulseLine className="size-4" />}
                  label="API health"
                  value={apiStatusLabel}
                  ok={apiOnline}
                />
                <StatusLine
                  icon={<RiKey2Line className="size-4" />}
                  label="OAuth tracking"
                  value="Google / Apple persisted"
                  ok
                />
                <StatusLine
                  icon={<RiTimeLine className="size-4" />}
                  label="Attention queue"
                  value={`${accountsNeedingAttention} accounts`}
                  ok={accountsNeedingAttention === 0}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid min-w-0 gap-6">
          <RecentUsersCard />

          <Card className="rounded-lg shadow-sm">
            <CardHeader>
              <CardTitle>Admin runbook</CardTitle>
              <CardDescription>
                What to inspect during product testing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <RunbookItem
                title="OAuth linkage"
                description="Confirm Apple private relay users are not being treated as duplicate real-email accounts."
              />
              <RunbookItem
                title="Onboarding state"
                description="Use account detail pages to unblock users stuck before travel style and interests are saved."
              />
              <RunbookItem
                title="Webhook sync"
                description="Confirm created and deleted Clerk users are reflected in Postgres before testing account flows."
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}

function AccountQueueRow({ user }: { user: AdminUser }) {
  return (
    <div className="border-border/60 flex items-center gap-3 rounded-lg border px-3 py-2.5">
      <Avatar className="border-border/50 size-10 border">
        <AvatarImage src={user.imageUrl ?? undefined} alt={user.email} />
        <AvatarFallback className="text-xs font-bold">
          {getInitials(user.name, user.email)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          {user.name ?? "Unnamed user"}
        </p>
        <p className="text-muted-foreground truncate text-xs">{user.email}</p>
        <AuthProviderBadges
          providers={user.authProviders}
          compact
          className="mt-2"
        />
      </div>
      <Button asChild variant="ghost" size="sm">
        <Link href={`/users/${user.id}`}>Open</Link>
      </Button>
    </div>
  )
}

function ProviderMeter({
  label,
  value,
  total,
}: {
  label: string
  value: number
  total: number
}) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {value} / {total}
        </span>
      </div>
      <Progress value={percent} className="h-2" />
    </div>
  )
}

function StatusLine({
  icon,
  label,
  value,
  ok,
}: {
  icon: React.ReactNode
  label: string
  value: string
  ok: boolean
}) {
  return (
    <div className="border-border/60 flex items-center justify-between gap-4 rounded-lg border px-3 py-2.5">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{label}</p>
          <p className="text-muted-foreground truncate text-xs">{value}</p>
        </div>
      </div>
      <Badge variant={ok ? "secondary" : "outline"}>
        {ok ? "OK" : "Review"}
      </Badge>
    </div>
  )
}

function RunbookItem({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="border-border/60 rounded-lg border px-3 py-3">
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-muted-foreground mt-1 text-sm leading-5">
        {description}
      </p>
    </div>
  )
}

function EmptyPanel({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode
  title: string
  body: string
}) {
  return (
    <div className="border-border/60 bg-muted/20 flex min-h-32 flex-col items-center justify-center gap-2 rounded-lg border p-6 text-center">
      <span className="text-muted-foreground">{icon}</span>
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-muted-foreground max-w-sm text-sm">{body}</p>
    </div>
  )
}

function getInitials(name: string | null, email: string): string {
  const source = name?.trim() || email
  return source
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function getDayPart(): string {
  const hour = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })
  ).getHours()

  if (hour >= 5 && hour < 12) return "morning"
  if (hour >= 12 && hour < 18) return "afternoon"
  return "evening"
}

export { DashboardOverview }
