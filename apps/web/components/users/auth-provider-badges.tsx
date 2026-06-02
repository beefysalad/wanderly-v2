import type { AuthProvider } from "@workspace/shared"
import { cn } from "@workspace/ui/lib/utils"

type AuthProviderBadgesProps = {
  providers: AuthProvider[]
  compact?: boolean
  className?: string
}

const PROVIDER_LABELS: Record<AuthProvider, string> = {
  GOOGLE: "Google",
  APPLE: "Apple",
}

function AuthProviderBadges({
  providers,
  compact = false,
  className,
}: AuthProviderBadgesProps) {
  if (providers.length === 0) {
    return (
      <span
        className={cn(
          "border-border text-muted-foreground inline-flex h-7 items-center rounded-full border border-dashed px-2.5 text-xs font-medium",
          compact && "h-6 px-2 text-[11px]",
          className
        )}
      >
        No OAuth
      </span>
    )
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {providers.map((provider) => (
        <span
          key={provider}
          className={cn(
            "border-border bg-background text-foreground inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-semibold shadow-sm",
            compact && "h-6 gap-1 px-2 text-[11px]"
          )}
        >
          <ProviderLogo provider={provider} compact={compact} />
          <span>{PROVIDER_LABELS[provider]}</span>
        </span>
      ))}
    </div>
  )
}

function ProviderLogo({
  provider,
  compact,
}: {
  provider: AuthProvider
  compact: boolean
}) {
  const sizeClass = compact ? "size-3" : "size-3.5"

  if (provider === "GOOGLE") {
    return <GoogleLogo className={sizeClass} />
  }

  return <AppleLogo className={cn(sizeClass, "text-foreground")} />
}

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.83-.07-1.43-.22-2.06H12v3.86h6.62c-.13.96-.85 2.42-2.45 3.39l-.02.13 3.56 2.39.25.02c2.28-1.82 3.53-4.5 3.53-7.73Z"
      />
      <path
        fill="#34A853"
        d="M12 23c3.26 0 5.99-.93 7.99-2.54l-3.8-3c-1.02.62-2.38 1.05-4.19 1.05-3.19 0-5.9-1.82-6.87-4.34l-.14.01-3.7 2.48-.05.12C3.22 20.45 7.27 23 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.13 14.17A6.07 6.07 0 0 1 4.8 12c0-.75.13-1.49.32-2.17l-.01-.14-3.75-2.52-.12.05A10.15 10.15 0 0 0 0 12c0 1.72.45 3.35 1.24 4.78l3.89-2.61Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.49c2.27 0 3.8.85 4.67 1.56l3.41-2.89C17.98 2.47 15.26 1 12 1 7.27 1 3.22 3.55 1.24 7.22l3.88 2.61C6.1 7.31 8.81 5.49 12 5.49Z"
      />
    </svg>
  )
}

function AppleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M17.15 12.75c-.03-2.77 2.28-4.11 2.38-4.17-1.3-1.9-3.31-2.16-4.02-2.19-1.7-.17-3.35 1-4.21 1-.88 0-2.22-.98-3.65-.95-1.88.03-3.62 1.09-4.58 2.77-1.96 3.39-.5 8.39 1.38 11.14.94 1.34 2.04 2.84 3.5 2.79 1.41-.06 1.94-.9 3.64-.9 1.69 0 2.19.9 3.66.87 1.53-.03 2.49-1.35 3.39-2.71 1.08-1.54 1.51-3.06 1.53-3.14-.03-.01-2.99-1.14-3.02-4.51ZM14.4 4.59c.76-.95 1.27-2.23 1.13-3.54-1.1.05-2.47.76-3.25 1.68-.69.81-1.31 2.14-1.15 3.39 1.24.09 2.48-.62 3.27-1.53Z"
      />
    </svg>
  )
}

export { AuthProviderBadges }
