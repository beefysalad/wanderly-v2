# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Authoritative Conventions

`AGENTS.md` at the repo root is the primary instruction file and contains the full ruleset. Read it before non-trivial changes. The notes below are the most important day-to-day rules.

## Commits & PRs (hard rules)

- **Never commit or push without an explicit request.** Do not run `git commit`, `git push`, `git stash`, or any state-changing git operation without being asked in the current turn.
- **Never include Claude attribution** in commit messages or PR descriptions. No `Co-Authored-By: Claude` trailer. No `🤖 Generated with Claude Code` footer. The user authors all commits.

## Repository Shape

npm-workspaces monorepo driven by Turborepo:

- `apps/mobile` — Expo React Native (primary product). Expo Router screens under `src/app/`, feature components under `src/components/`, TanStack Query hooks under `src/hooks/`, Axios wrappers under `src/lib/api/`, Zod schemas under `src/lib/validations/`.
- `apps/api` — NestJS backend. Feature modules under `src/<feature>/`. Prisma client generated into `src/generated/`. Uses `@clerk/backend` for auth and Postgres via `@prisma/adapter-pg`.
- `apps/web` — Next.js App Router (web dashboard / admin, secondary).
- `packages/shared` — shared HTTP contract types (`@workspace/shared`). Type-only consumption preferred.
- `packages/ui` — shared shadcn/ui components (`@workspace/ui`). Web only.
- `packages/eslint-config`, `packages/typescript-config` — shared tool configs.

## Common Commands

```bash
# Dev
npm run dev                  # turbo dev — all workspaces
npm run dev:mobile           # mobile only (expo start)
npm run dev:api              # api only
npm run dev:web              # web only

# Mobile
npm run start -w mobile -- --clear   # clear cache on restart

# Verification (narrowest first)
npm run typecheck -w mobile
npm run typecheck -w api
npm run build -w api         # runs prisma generate + nest build
npm run test -w api          # Jest *.spec.ts

# Full repo
npm run lint
npm run typecheck
npm run build

# Prisma (api workspace)
npm run db:generate
npm run db:migrate:deploy    # do not run unless user asks
```

Do not run `npm install` or Prisma migrations unless explicitly asked. Provide the exact command instead.

Installing deps: `npm install <pkg> -w mobile` · `-w api` · `-w web` · `-w @workspace/shared`; root tooling with `npm install -D <pkg>`.

## Environment Variables

| File | Purpose |
|---|---|
| `.env` | Docker Compose / root |
| `apps/mobile/.env.local` | Expo mobile (`EXPO_PUBLIC_` prefix required) |
| `apps/api/.env` | NestJS + Prisma |
| `apps/web/.env.local` | Next.js web |

Always update the matching `.env.example` when adding a required var. Never commit real `.env` files.

## Mobile Patterns (strictly enforced)

**One component per file.** Every component gets its own file. No component defined inside another component's file unless it is a tiny, truly local sub-element (< 20 lines, used nowhere else).

**TanStack Query always in hooks.** Never declare `useQuery`, `useMutation`, or `useInfiniteQuery` inside a screen or component file. Every query and mutation lives in `src/hooks/<domain>/use-<resource>.ts`.

**Never call Axios directly in components or screens.** All HTTP calls go through API wrapper functions in `src/lib/api/<domain>.ts`, which screens call via hooks.

**Auth token only through `useAuthedClient()`.** Never call `useAuth().getToken()` directly in a component or hook. Token injection is centralized in `src/lib/auth.ts`.

**Screens stay thin.** `src/app/**/*.tsx` files import and render a feature component. No business logic, no queries, no long JSX trees inline in a screen file.

**Always handle loading, error, and empty states** from TanStack Query before rendering data. Never assume `data` is immediately available.

**NativeWind classes over StyleSheet.** Use Tailwind utility classes via NativeWind. Do not use `StyleSheet.create({})` unless there is a documented reason a class cannot do it.

**Forms use React Hook Form + Zod.** Validation schemas go in `src/lib/validations/`. Never build a form with ad hoc `useState` when RHF is appropriate.

## Backend Patterns (strictly enforced)

Thin controllers → injectable services → repository classes for data access.

- Controllers validate and route only — delegate everything to services.
- Business logic in services; Prisma calls in repositories.
- DTOs for all request shapes; avoid `any`; explicit return types at every layer boundary.
- Private helpers in a class are prefixed with `_` (e.g. `_buildJoinCode`).

## API Boundary

HTTP request/response types shared by mobile and api live in `packages/shared` and are imported type-only. Do not duplicate contract types. Do not put app code in `packages/shared`.
