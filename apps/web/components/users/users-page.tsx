"use client"

import type { AdminUser } from "@workspace/shared"
import type { ColumnDef } from "@tanstack/react-table"
import { RiArrowRightLine, RiErrorWarningLine } from "@remixicon/react"
import Link from "next/link"
import { useMemo } from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { DataTable } from "@workspace/ui/components/data-table"
import { DataTableColumnHeader } from "@workspace/ui/components/data-table-column-header"
import { Skeleton } from "@workspace/ui/components/skeleton"

import { useAdminUsers } from "@/hooks/api/use-admin-users"
import { AuthProviderBadges } from "@/components/users/auth-provider-badges"

function getInitials(name: string | null, email: string): string {
  const source = name?.trim() || email
  return source
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

export function UsersPage() {
  const { data, isPending, isError, error } = useAdminUsers()
  const users = data?.users ?? []

  const columns = useMemo<ColumnDef<AdminUser>[]>(
    () => [
      {
        accessorKey: "email",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Account" />
        ),
        cell: ({ row }) => {
          const user = row.original

          return (
            <div className="flex min-w-[260px] items-center gap-3">
              <Avatar className="border-border/50 size-9 border">
                <AvatarImage
                  src={user.imageUrl ?? undefined}
                  alt={user.name ?? user.email}
                />
                <AvatarFallback className="text-xs font-bold">
                  {getInitials(user.name, user.email)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-foreground truncate text-sm font-semibold">
                  {user.name ?? "Unnamed user"}
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {user.email}
                </p>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: "authProviders",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Provider" />
        ),
        cell: ({ row }) => (
          <AuthProviderBadges providers={row.original.authProviders} compact />
        ),
      },
      {
        accessorKey: "hasCompletedOnboarding",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Onboarding" />
        ),
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.hasCompletedOnboarding ? "secondary" : "outline"
            }
          >
            {row.original.hasCompletedOnboarding ? "Complete" : "Pending"}
          </Badge>
        ),
      },
      {
        accessorKey: "travelStyle",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Travel style" />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {row.original.travelStyle.replace("_", " ").toLowerCase()}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Created" />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {formatDate(row.original.createdAt)}
          </span>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
          <Button asChild variant="ghost" size="sm" className="ml-auto">
            <Link href={`/users/${row.original.id}`}>
              View
              <RiArrowRightLine data-icon="inline-end" />
            </Link>
          </Button>
        ),
      },
    ],
    []
  )

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <section className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">Admin</p>
          <h1 className="font-heading text-3xl font-semibold tracking-normal md:text-4xl">
            Accounts
          </h1>
          <p className="text-muted-foreground text-sm">
            <span className="text-foreground font-semibold">
              {users.length}
            </span>{" "}
            synced traveler accounts available to the admin console.
          </p>
        </div>
      </section>

      {isPending ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full max-w-sm" />
          <Skeleton className="h-80 w-full rounded-lg" />
        </div>
      ) : isError ? (
        <div className="border-border bg-card flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border p-8 text-center">
          <RiErrorWarningLine className="text-destructive size-6" />
          <div>
            <p className="font-medium">Could not load admin accounts.</p>
            <p className="text-muted-foreground mt-1 text-sm">
              {error instanceof Error
                ? error.message
                : "The admin users endpoint returned an error."}
            </p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={users}
          filterColumnId="email"
          filterPlaceholder="Search accounts by email..."
          noResultsMessage="No accounts found."
          pageSizeOptions={[10, 20, 50]}
        />
      )}
    </main>
  )
}
