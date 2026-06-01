# Web Admin Auth Implementation Plan

> **For agentic workers:** Build Clerk-backed admin authentication pages for the Next.js web admin. Do not introduce custom auth.

**Goal:** Add dedicated sign-in and sign-up pages for the Wanderly web admin panel, using the existing Clerk web integration.

**Architecture:** Web routes live in `apps/web/app`. Clerk remains the identity provider. Protected admin pages continue to use `auth.protect()` and backend authorization continues to rely on Clerk JWT claims through the API `ClerkGuard`.

**Tech Stack:** Next.js App Router, Clerk Next.js SDK, `@workspace/ui`, Tailwind.

---

## v1 Review

- v1 admin auth used `x-admin-password` and sessionStorage.
- Do not port that pattern. v2 product docs explicitly replace it with Clerk-backed roles.
- Useful v1 concept: web admin starts with account visibility and later grows into config/stats/maintenance tools.

## Files

- Create: `apps/web/app/sign-in/[[...sign-in]]/page.tsx`
- Create: `apps/web/app/sign-up/[[...sign-up]]/page.tsx`
- Create: `apps/web/app/not-authorized/page.tsx`
- Create: `apps/web/components/auth/admin-auth-frame.tsx`
- Create: `apps/web/components/auth/admin-access-denied.tsx`
- Create: `apps/web/lib/auth/admin-access.ts`
- Modify: `apps/web/app/layout.tsx`
- Modify: `apps/web/app/(protected)/layout.tsx`
- Modify: `apps/web/components/auth/auth-header.tsx`
- Modify: `apps/web/.env.example`
- Modify: `AGENTS.md`

## Tasks

- [x] Add Prisma migration workflow note to `AGENTS.md`.
- [x] Add reusable admin auth frame for Clerk pages.
- [x] Add path-routed Clerk sign-in page.
- [x] Add path-routed Clerk sign-up page.
- [x] Configure Clerk provider and protected layout redirects to use dedicated auth pages.
- [x] Reject signed-in users without Clerk admin claims from the protected admin shell.
- [x] Replace marketing header auth modals with links to the dedicated pages.
- [x] Verify with `npm run typecheck -w web`.
- [x] Verify with `npm run build -w web`.
