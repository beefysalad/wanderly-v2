const adminAuthAppearance = {
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none",
    card: "w-full border border-border bg-background px-7 py-7 shadow-sm sm:px-8",
    headerTitle: "font-heading text-2xl font-semibold tracking-normal",
    headerSubtitle: "text-muted-foreground text-sm",
    socialButtonsBlockButton:
      "border-border bg-background text-foreground shadow-none hover:bg-muted",
    socialButtonsBlockButtonText: "font-medium",
    dividerLine: "bg-border",
    dividerText: "text-muted-foreground text-xs",
    formFieldLabel: "text-foreground text-sm font-medium",
    formFieldInput:
      "border-border bg-background text-foreground shadow-none focus:ring-2 focus:ring-ring/30",
    formButtonPrimary:
      "bg-primary text-primary-foreground shadow-none hover:bg-primary/90",
    footerActionText: "text-muted-foreground text-sm",
    footerActionLink: "text-primary text-sm font-semibold hover:text-primary/80",
    identityPreviewText: "text-foreground",
    formFieldAction: "text-primary hover:text-primary/80",
    alert: "border-border bg-muted text-foreground",
  },
} as const

export { adminAuthAppearance }
