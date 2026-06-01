import Link from "next/link"
import {
  RiDatabase2Line,
  RiShieldCheckLine,
  RiUserSettingsLine,
} from "@remixicon/react"

import { Badge } from "@workspace/ui/components/badge"

type AdminAuthFrameProps = {
  children: React.ReactNode
  eyebrow: string
  title: string
  description: string
}

const AUTH_POINTS = [
  {
    icon: RiUserSettingsLine,
    label: "Account operations",
    detail: "Review synced travelers and keep account records tidy.",
  },
  {
    icon: RiShieldCheckLine,
    label: "Clerk-backed access",
    detail: "Admin authority stays tied to verified identity claims.",
  },
  {
    icon: RiDatabase2Line,
    label: "Database visibility",
    detail: "Start with user accounts, then grow into stats and controls.",
  },
]

function AdminAuthFrame({
  children,
  eyebrow,
  title,
  description,
}: AdminAuthFrameProps) {
  return (
    <main className="bg-background text-foreground grid min-h-svh lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.72fr)]">
      <section className="bg-sidebar text-sidebar-foreground relative hidden overflow-hidden border-r lg:flex">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0,transparent_42%),radial-gradient(circle_at_18%_20%,rgba(255,122,107,0.18),transparent_28%)]" />
        <div className="relative flex min-h-svh w-full flex-col justify-between p-10 xl:p-12">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="bg-sidebar-primary text-sidebar-primary-foreground flex size-9 items-center justify-center rounded-lg text-sm font-black">
                W
              </span>
              <span className="grid leading-tight">
                <span className="text-sm font-semibold">Wanderly Admin</span>
                <span className="text-sidebar-foreground/60 text-xs">
                  Operations console
                </span>
              </span>
            </Link>
            <Badge variant="secondary" className="rounded-md">
              Clerk
            </Badge>
          </div>

          <div className="max-w-xl space-y-8">
            <div className="space-y-4">
              <p className="text-sidebar-foreground/60 text-xs font-semibold tracking-normal uppercase">
                {eyebrow}
              </p>
              <h1 className="font-heading text-5xl leading-[0.95] font-semibold tracking-normal xl:text-6xl">
                {title}
              </h1>
              <p className="text-sidebar-foreground/70 max-w-md text-base leading-7">
                {description}
              </p>
            </div>

            <div className="grid gap-3">
              {AUTH_POINTS.map((point) => {
                const Icon = point.icon

                return (
                  <div
                    key={point.label}
                    className="border-sidebar-border/70 bg-sidebar-accent/35 flex gap-3 rounded-lg border p-4"
                  >
                    <span className="bg-sidebar-primary/15 text-sidebar-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                      <Icon className="size-5" />
                    </span>
                    <span className="grid gap-1">
                      <span className="text-sm font-semibold">
                        {point.label}
                      </span>
                      <span className="text-sidebar-foreground/60 text-sm leading-5">
                        {point.detail}
                      </span>
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <p className="text-sidebar-foreground/45 text-xs">
            Admin access is controlled by Clerk identity and backend claims.
          </p>
        </div>
      </section>

      <section className="flex min-h-svh items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-[430px] space-y-7">
          <div className="space-y-3 lg:hidden">
            <Link href="/" className="flex items-center gap-3">
              <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg text-sm font-black">
                W
              </span>
              <span className="grid leading-tight">
                <span className="text-sm font-semibold">Wanderly Admin</span>
                <span className="text-muted-foreground text-xs">
                  Operations console
                </span>
              </span>
            </Link>
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs font-semibold tracking-normal uppercase">
                {eyebrow}
              </p>
              <h1 className="font-heading text-3xl font-semibold tracking-normal">
                {title}
              </h1>
            </div>
          </div>

          {children}
        </div>
      </section>
    </main>
  )
}

export { AdminAuthFrame }
export type { AdminAuthFrameProps }
