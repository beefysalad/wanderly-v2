"use client"

import Link from "next/link"
import {
  RiArrowLeftLine,
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiLoader4Line,
} from "@remixicon/react"

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
import { Separator } from "@workspace/ui/components/separator"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Switch } from "@workspace/ui/components/switch"

import { useAdminUser } from "@/hooks/api/use-admin-user"
import { useUpdateAdminUser } from "@/hooks/api/use-update-admin-user"
import { AuthProviderBadges } from "@/components/users/auth-provider-badges"

type UserDetailPageProps = {
  userId: string
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

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

function UserDetailPage({ userId }: UserDetailPageProps) {
  const { data: user, isPending, isError, error } = useAdminUser(userId)
  const updateUser = useUpdateAdminUser()

  const handleOnboardingChange = (checked: boolean) => {
    updateUser.mutate({
      userId,
      input: {
        hasCompletedOnboarding: checked,
      },
    })
  }

  if (isPending) {
    return (
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-52 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </main>
    )
  }

  if (isError || !user) {
    return (
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
        <Button asChild variant="ghost" className="w-fit">
          <Link href="/users">
            <RiArrowLeftLine data-icon="inline-start" />
            Back to accounts
          </Link>
        </Button>
        <div className="border-border bg-card flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border p-8 text-center">
          <RiErrorWarningLine className="text-destructive size-6" />
          <div>
            <p className="font-medium">Could not load this user.</p>
            <p className="text-muted-foreground mt-1 text-sm">
              {error instanceof Error
                ? error.message
                : "The admin user detail endpoint returned an error."}
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <Button asChild variant="ghost" className="w-fit">
        <Link href="/users">
          <RiArrowLeftLine data-icon="inline-start" />
          Back to accounts
        </Link>
      </Button>

      <section className="border-border bg-card rounded-lg border p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar className="border-border size-16 border">
              <AvatarImage src={user.photoUrl ?? undefined} alt={user.email} />
              <AvatarFallback className="text-base font-bold">
                {getInitials(user.name, user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-muted-foreground text-sm">Account detail</p>
              <h1 className="font-heading truncate text-3xl font-semibold tracking-normal">
                {user.name ?? "Unnamed user"}
              </h1>
              <p className="text-muted-foreground truncate text-sm">
                {user.email}
              </p>
              <AuthProviderBadges
                providers={user.authProviders}
                compact
                className="mt-2"
              />
            </div>
          </div>

          <Badge
            variant={user.hasCompletedOnboarding ? "secondary" : "outline"}
          >
            {user.hasCompletedOnboarding ? "Onboarded" : "Onboarding pending"}
          </Badge>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Data synced from the traveler account profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <DetailRow label="Database ID" value={user.id} mono />
            <DetailRow label="Clerk ID" value={user.clerkId} mono />
            <div className="grid gap-1 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-4">
              <dt className="text-muted-foreground text-sm">Auth providers</dt>
              <dd>
                <AuthProviderBadges providers={user.authProviders} />
              </dd>
            </div>
            <DetailRow
              label="Travel style"
              value={user.travelStyle.replace("_", " ").toLowerCase()}
            />
            <DetailRow
              label="Bio"
              value={user.bio?.trim() ? user.bio : "No bio set"}
            />
            <DetailRow
              label="Interests"
              value={
                user.interests.length > 0
                  ? user.interests.join(", ")
                  : "No interests set"
              }
            />
            <Separator />
            <DetailRow label="Created" value={formatDateTime(user.createdAt)} />
            <DetailRow label="Updated" value={formatDateTime(user.updatedAt)} />
          </CardContent>
        </Card>

        <Card className="rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle>Controls</CardTitle>
            <CardDescription>
              Admin-only switches for testing account state.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Onboarding complete</p>
                <p className="text-muted-foreground text-sm leading-5">
                  Toggle whether the mobile app should treat this user as
                  already onboarded.
                </p>
              </div>
              <Switch
                checked={user.hasCompletedOnboarding}
                disabled={updateUser.isPending}
                onCheckedChange={handleOnboardingChange}
              />
            </div>

            {updateUser.isPending ? (
              <p className="text-muted-foreground flex items-center gap-2 text-sm">
                <RiLoader4Line className="size-4 animate-spin" />
                Updating account state...
              </p>
            ) : updateUser.isSuccess ? (
              <p className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                <RiCheckboxCircleLine className="size-4" />
                Account state updated.
              </p>
            ) : null}

            {updateUser.isError ? (
              <p className="text-destructive text-sm">
                {updateUser.error instanceof Error
                  ? updateUser.error.message
                  : "Could not update this account."}
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

type DetailRowProps = {
  label: string
  value: string
  mono?: boolean
}

function DetailRow({ label, value, mono = false }: DetailRowProps) {
  return (
    <div className="grid gap-1 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-4">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd
        className={
          mono
            ? "bg-muted text-muted-foreground w-fit max-w-full truncate rounded px-2 py-1 font-mono text-xs"
            : "text-foreground min-w-0 text-sm"
        }
      >
        {value}
      </dd>
    </div>
  )
}

export { UserDetailPage }
