"use client"

import Link from "next/link"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import type { AdminUser } from "@workspace/shared"

import { useAdminUsers } from "@/hooks/api/use-admin-users"

function getInitials(name: string | null, email: string): string {
  const source = name?.trim() || email
  return source
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function RecentUsersCard() {
  const { data, isLoading } = useAdminUsers()
  const users = data?.users?.slice(0, 5) ?? []

  return (
    <Card className="rounded-lg shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Recent Users</CardTitle>
        <CardDescription>
          Latest accounts synced to your workspace.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="size-9 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))
        ) : users.length === 0 ? (
          <div className="border-border text-muted-foreground flex h-32 items-center justify-center rounded-lg border border-dashed text-sm">
            No recent users found.
          </div>
        ) : (
          users.map((user: AdminUser) => (
            <Link
              href={`/users/${user.id}`}
              key={user.id}
              className="hover:bg-muted/50 -mx-2 flex items-center gap-4 rounded-lg px-2 py-1.5 transition-colors"
            >
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
                <p className="text-foreground truncate text-sm font-bold">
                  {user.name ?? "Unnamed user"}
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {user.email}
                </p>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  )
}
