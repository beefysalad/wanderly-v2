"use client"

import {
  RiCheckboxCircleLine,
  RiDatabase2Line,
  RiKey2Line,
  RiRefreshLine,
  RiServerLine,
} from "@remixicon/react"
import { useMemo } from "react"

import { AuthProviderBadges } from "@/components/users/auth-provider-badges"
import { useApiHealth } from "@/hooks/api/use-api-health"
import { useAdminUsers } from "@/hooks/api/use-admin-users"
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
import { Separator } from "@workspace/ui/components/separator"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

export function DataPage() {
  const {
    data: health,
    isPending: isHealthPending,
    isError: isHealthError,
    refetch: refetchHealth,
    dataUpdatedAt: healthUpdatedAt,
  } = useApiHealth()
  const {
    data,
    isPending: isUsersPending,
    isError: isUsersError,
    refetch: refetchUsers,
    dataUpdatedAt: usersUpdatedAt,
  } = useAdminUsers()

  const users = useMemo(() => data?.users ?? [], [data?.users])

  const onboardedCount = users.filter(
    (user) => user.hasCompletedOnboarding
  ).length
  const pendingOnboardingCount = users.length - onboardedCount
  const oauthLinkedCount = users.filter(
    (user) => user.authProviders.length > 0
  ).length
  const noOauthCount = users.length - oauthLinkedCount
  const googleLinkedCount = users.filter((user) =>
    user.authProviders.includes("GOOGLE")
  ).length
  const appleLinkedCount = users.filter((user) =>
    user.authProviders.includes("APPLE")
  ).length
  const onboardingRate =
    users.length > 0 ? Math.round((onboardedCount / users.length) * 100) : 0
  const latestSyncAt = Math.max(healthUpdatedAt, usersUpdatedAt)
  const lastUpdatedLabel =
    latestSyncAt > 0
      ? new Date(latestSyncAt).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })
      : "Not synced yet"

  const handleRefresh = () => {
    void refetchHealth()
    void refetchUsers()
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">Operations</p>
          <h1 className="font-heading text-3xl font-semibold tracking-normal md:text-4xl">
            System health
          </h1>
          <p className="text-muted-foreground max-w-2xl text-sm">
            Inspect backend availability, account sync, onboarding state, and
            OAuth linkage for admin review.
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <Badge variant="secondary" className="h-8 px-3 text-xs font-medium">
            Last updated {lastUpdatedLabel}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 sm:w-auto"
            onClick={handleRefresh}
          >
            <RiRefreshLine className="size-4" />
            Refresh data
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Backend API"
          value={
            isHealthPending
              ? "Checking..."
              : health?.status === "ok"
                ? "Online"
                : "Issue"
          }
          description={
            isHealthError
              ? "The API health check could not be reached."
              : health?.timestamp
                ? `Last checked ${new Date(health.timestamp).toLocaleTimeString()}`
                : "Waiting for the latest backend status."
          }
          icon={<RiServerLine className="size-4" />}
        />
        <MetricCard
          title="Account registry"
          value={isUsersPending ? "Loading..." : users.length.toString()}
          description="Records available from the admin users endpoint."
          icon={<RiDatabase2Line className="size-4" />}
        />
        <MetricCard
          title="OAuth linked"
          value={isUsersPending ? "Loading..." : oauthLinkedCount.toString()}
          description={`${noOauthCount} accounts have no Google or Apple provider recorded.`}
          icon={<RiKey2Line className="size-4" />}
        />
        <MetricCard
          title="Onboarding backlog"
          value={
            isUsersPending ? "Loading..." : pendingOnboardingCount.toString()
          }
          description={`${onboardedCount} accounts have completed mobile onboarding.`}
          icon={<RiCheckboxCircleLine className="size-4" />}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/60">
          <CardHeader className="gap-2">
            <CardTitle className="text-base font-semibold">
              Account registry sample
            </CardTitle>
            <CardDescription>
              Identity, OAuth, and onboarding fields available to the admin
              console.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-border/50 overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20 hover:bg-muted/20">
                    <TableHead className="px-6 py-4">Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Onboarding</TableHead>
                    <TableHead className="px-6 text-right">Clerk ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isUsersPending ? (
                    [...Array(5)].map((_, index) => (
                      <TableRow key={index}>
                        <TableCell className="px-6 py-4">
                          <Skeleton className="h-4 w-28" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-40" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-24 rounded-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-20 rounded-full" />
                        </TableCell>
                        <TableCell className="px-6 text-right">
                          <Skeleton className="ml-auto h-4 w-20" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : isUsersError ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-muted-foreground h-28 text-center"
                      >
                        We could not load synced user records right now.
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-muted-foreground h-28 text-center"
                      >
                        No synced records yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="px-6 py-4 font-medium">
                          {user.name ?? "Unnamed user"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <AuthProviderBadges
                            providers={user.authProviders}
                            compact
                          />
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.hasCompletedOnboarding
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {user.hasCompletedOnboarding
                              ? "Complete"
                              : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 text-right">
                          <code className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[10px]">
                            {user.clerkId.slice(-8)}
                          </code>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card className="border-border/60">
            <CardHeader className="gap-2">
              <CardTitle className="text-base font-semibold">
                Account readiness
              </CardTitle>
              <CardDescription>
                Users that need admin review because onboarding is incomplete or
                OAuth linkage is missing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {isUsersPending ? (
                <div className="space-y-3">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Onboarding completion
                      </span>
                      <span className="font-medium">{onboardingRate}%</span>
                    </div>
                    <Progress value={onboardingRate} className="h-2" />
                  </div>
                  <Separator />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <StatusBlock
                      label="Pending onboarding"
                      value={pendingOnboardingCount.toString()}
                    />
                    <StatusBlock
                      label="No OAuth provider"
                      value={noOauthCount.toString()}
                    />
                    <StatusBlock
                      label="Google linked"
                      value={googleLinkedCount.toString()}
                    />
                    <StatusBlock
                      label="Apple linked"
                      value={appleLinkedCount.toString()}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="gap-2">
              <CardTitle className="text-base font-semibold">
                Backend connection
              </CardTitle>
              <CardDescription>
                Snapshot of the API used by the admin console.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isHealthPending ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Status
                    </span>
                    <Badge
                      variant={
                        !isHealthError && health?.status === "ok"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {!isHealthError && health?.status === "ok"
                        ? "Online"
                        : "Attention needed"}
                    </Badge>
                  </div>
                  <Separator />
                  <StatusBlock
                    label="Backend timestamp"
                    value={
                      isHealthError
                        ? "Health endpoint unavailable"
                        : (health?.timestamp ?? "No timestamp returned")
                    }
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}

function MetricCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardDescription>{title}</CardDescription>
          <CardTitle className="text-2xl font-semibold tracking-normal">
            {value}
          </CardTitle>
        </div>
        <div className="border-border/60 bg-muted/30 text-muted-foreground rounded-lg border p-2">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  )
}

function StatusBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="text-foreground text-base font-medium">{value}</p>
    </div>
  )
}
