# AI Implementation Guide

This is the authoritative instruction file for AI agents working in this repository.
Follow these rules unless the user explicitly asks for a different approach.

## Repository Skills & Agents

- `/feature-architect` — spec a feature, write a plan in `docs/plan/`, create a Jira ticket in `WND`. Dispatches `v1-expert` when the feature existed in Wanderly v1.
- `v1-expert` subagent — reads the real v1 codebase at `/Users/jpatrickzxc/Documents/coding/travelscheduleapp` and gives a critical assessment of v1 patterns before porting.

## Commits & PRs (hard rules)

- **Never commit or push without an explicit request.** Even for a "small" change — do not run `git commit`, `git push`, `git stash`, `git checkout` to another branch, or any other state-changing git operation without being asked in the current turn.
- **Never include Claude attribution** in commit messages or PR descriptions. No `Co-Authored-By: Claude` trailer. No `🤖 Generated with Claude Code` footer. The user authors all commits and PRs. These rules override the global harness defaults.

## Repository Context

npm-workspaces monorepo using Turborepo.

Primary workspaces:

- `apps/mobile`: Expo React Native (SDK 56, Expo Router). The **primary product**.
- `apps/api`: NestJS backend (controller → service → repository pattern).
- `apps/web`: Next.js App Router (web dashboard / admin, secondary).
- `packages/shared`: shared HTTP contract types (`@workspace/shared`).
- `packages/ui`: shared shadcn/ui components (`@workspace/ui`) — web only.
- `packages/eslint-config`, `packages/typescript-config`: shared tool configs.

Use npm from the repository root. Do not create nested lockfiles.

## Environment Variables

- Templates committed in `.env.example`, `apps/mobile/.env.example`, `apps/api/.env.example`, `apps/web/.env.example`.
- Never commit real secrets or real `.env` files.
- Mobile vars exposed to native code must be prefixed `EXPO_PUBLIC_`.
- Backend secrets must never be in `EXPO_PUBLIC_` or `NEXT_PUBLIC_` vars.
- Update the relevant `.env.example` whenever adding a required var.
- Docker Compose API connects to Postgres via `postgres` hostname; host-run API uses `localhost:5433`.

## Core Principles

- Keep implementations modular and easy to extend.
- Prefer existing project patterns over inventing new ones.
- Reuse components, hooks, API wrappers, services, and repositories whenever practical.
- **Keep files focused.** If a file is growing, split it. Do not leave unrelated logic buried in a component or screen.
- **Never use TypeScript `any`.** Prefer explicit, narrow types, `unknown` plus validation/narrowing, generics, or local interfaces.
- **Never use the `Sparkles` icon** from any icon set. Choose a domain-specific icon instead, or omit the icon when no specific symbol fits.
- Do not run destructive git commands unless the user explicitly asks.

## Dependency Rules

- Do not run `npm install` unless the user explicitly asks. Provide the exact command instead.
- Install mobile packages: `npm install <pkg> -w mobile`
- Install backend packages: `npm install <pkg> -w api`
- Install web packages: `npm install <pkg> -w web`
- Install shared contract packages: `npm install <pkg> -w @workspace/shared` — only when genuinely needed by shared contracts
- Install root tooling: `npm install -D <pkg>` at the repo root
- Do not create `package-lock.json` files inside any workspace directory.

---

## Mobile Rules (`apps/mobile`)

### The non-negotiables

These are hard rules. Do not violate them:

**1. One component per file.**
Every React component gets its own file. Never define more than one exported component in a file. The only exception: a tiny, purely local sub-element (< 20 lines, no independent state, used nowhere else) may live inline — and even then, consider splitting it.

**2. TanStack Query never in components or screens.**
Never call `useQuery`, `useMutation`, `useInfiniteQuery`, or `useQueryClient()` directly inside a screen or component file. Every query and mutation lives in a dedicated hook file under `src/hooks/<domain>/use-<resource>.ts`. Components call the hook, not the query.

```
✅  const { data, isPending } = useExpenses(tripId)   // hook call in component
❌  const { data } = useQuery({ queryKey: [...], queryFn: fetchExpenses })  // inline in component
```

**3. Never call Axios directly in components, screens, or hooks.**
All HTTP calls go through API wrapper functions in `src/lib/api/<domain>.ts`. Hooks call the wrapper; components call the hook. Nothing else touches Axios.

```
✅  // src/lib/api/expenses.ts
    export async function getExpenses(tripId: string): Promise<Expense[]> { ... }

✅  // src/hooks/expenses/use-expenses.ts
    export function useExpenses(tripId: string) {
      return useQuery({ queryKey: ['expenses', tripId], queryFn: () => getExpenses(tripId) })
    }

❌  // inside a component
    const { data } = useQuery({ queryFn: () => apiClient.get('/expenses') })
```

**4. Auth token only through `useAuthedClient()`.**
Never call `useAuth().getToken()` directly in a component or hook. Token injection lives in `src/lib/auth.ts` (`useAuthedClient()`). Hooks that need auth import and use that function.

**5. Screens stay thin.**
`src/app/**/*.tsx` files are routing entry points. They import and render a single feature component. No business logic, no query declarations, no long JSX trees inline in a screen file. If a screen is growing, extract a feature component.

**6. Always render loading, error, and empty states.**
Any component that consumes TanStack Query data must explicitly handle all three states before rendering data. Never assume `data` is immediately available.

```tsx
// Required pattern
if (isPending) return <LoadingSpinner />
if (isError) return <ErrorState error={error} />
if (!data?.length) return <EmptyState message="No expenses yet" />
return <ExpenseList expenses={data} />
```

**7. NativeWind classes over StyleSheet.**
Use Tailwind utility classes via NativeWind. Do not use `StyleSheet.create({})` unless a specific styling need genuinely cannot be expressed as a class (e.g. animated inline transforms, dynamic runtime values). Document the reason when you do.

**8. Forms use React Hook Form + Zod.**
Never build a form with ad hoc `useState` per field when React Hook Form is appropriate. Validation schemas go in `src/lib/validations/`. Shared schemas that are reused across mobile and api go in `packages/shared`.

### Mobile folder structure

```
apps/mobile/src/
├── app/                          # Expo Router screens (thin — import & render only)
│   ├── _layout.tsx               # ClerkProvider + QueryClientProvider root
│   ├── index.tsx                 # Redirect → (auth) or (tabs)
│   ├── (auth)/
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   ├── (tabs)/
│   │   ├── index.tsx             # Home
│   │   └── profile.tsx
│   ├── trip/[tripId]/
│   │   ├── index.tsx             # Trip detail
│   │   ├── expenses.tsx
│   │   └── ai-plan.tsx
│   └── group/[groupId]/
│       ├── index.tsx
│       └── members.tsx
├── components/                   # ONE component per file, grouped by domain
│   ├── groups/
│   ├── trips/
│   ├── expenses/
│   ├── ai/
│   ├── shared/                   # EmptyState, LoadingSpinner, ErrorBoundary, etc.
│   └── ui/                       # App-local primitives (Button, Input, Card, etc.)
├── hooks/                        # TanStack Query hooks, grouped by domain
│   ├── groups/
│   │   ├── use-groups.ts
│   │   └── use-group.ts
│   ├── trips/
│   ├── expenses/
│   ├── notifications/
│   └── ai/
├── lib/
│   ├── axios.ts                  # Axios client (reads EXPO_PUBLIC_API_URL)
│   ├── auth.ts                   # useAuthedClient() — Clerk token interceptor
│   ├── query-client.ts           # QueryClient singleton
│   └── api/                      # API wrapper functions, grouped by domain
│       ├── groups.ts
│       ├── trips.ts
│       ├── activities.ts
│       ├── expenses.ts
│       └── notifications.ts
├── lib/validations/              # Zod schemas (mobile-only)
├── constants/
│   └── theme.ts                  # Colors, spacing, typography tokens
├── types/                        # Mobile-only TypeScript types (not shared contracts)
└── global.css                    # NativeWind base styles
```

### Styling rules

- Use NativeWind Tailwind classes as the default.
- Use `constants/theme.ts` tokens for colors and spacing that repeat — do not scatter raw hex values.
- Always consider both light and dark mode. Test contrast, surfaces, borders, and text in both before considering UI work done. Use `dark:` variants.
- Do not use one-off tinted values like hardcoded `#e3f2fd` or inline `style={{ backgroundColor: 'rgba(...)' }}` when a class can express the intent.

### Auth pattern

```typescript
// src/lib/auth.ts — THE ONLY place token injection happens
export function useAuthedClient() {
  const { getToken } = useAuth();
  apiClient.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  return apiClient;
}

// src/hooks/expenses/use-expenses.ts
export function useExpenses(tripId: string) {
  useAuthedClient(); // sets the interceptor
  return useQuery({
    queryKey: ['expenses', tripId],
    queryFn: () => getExpenses(tripId),
  });
}
```

---

## Backend Rules (`apps/api`)

### NestJS architecture

- **Thin controllers.** Controllers validate the request and delegate to services. No business logic in controllers.
- **Business logic in services.** Services own decisions: what to create, how to validate, what to return.
- **Data access in repositories.** Prisma calls belong in repository classes, not services or controllers.
- Prefer feature modules: `users`, `groups`, `trips`, `activities`, `expenses`, `notifications`, `upload`, `ai`.
- Avoid stuffing unrelated features into `app.service.ts`.

### Backend folder structure

```
apps/api/src/
├── main.ts
├── app.module.ts
├── common/
│   ├── guards/
│   │   └── clerk.guard.ts
│   ├── decorators/
│   │   └── current-user.decorator.ts
│   └── filters/
├── webhooks/
│   └── clerk-webhook.controller.ts
└── <feature>/
    ├── <feature>.module.ts
    ├── <feature>.controller.ts
    ├── <feature>.service.ts
    ├── <feature>.repository.ts
    └── dto/
```

### Backend typing

- Never use TypeScript `any`. Use explicit DTOs for request shapes and explicit return types at every controller/service/repository boundary.
- Repository-local types (narrow DB payload shapes) stay in the repository file. Shared HTTP contract types go in `packages/shared`.
- Private helper methods in a class are prefixed with `_` (e.g. `_buildJoinCode`, `_calculateBalance`).
- Do not put business logic or unrelated helpers in repositories. A repository is a persistence layer, not a second service.

### Auth

- Protect all routes except webhooks with `ClerkGuard`.
- Extract `clerkId` from the JWT via `@CurrentUser()` decorator — never trust a user-supplied `userId` in the request body.
- Clerk `user.created` / `user.deleted` webhooks (verified via svix) create/delete the `User` row in Postgres. No `/sync` endpoint.

### Database

- Prisma schema lives at `apps/api/prisma/schema.prisma`.
- Run `npm run db:generate -w api` after schema changes.
- Do not run `npm run db:migrate:deploy` unless the user asks — tell them the command instead.
- Prisma calls stay in repositories. Do not use `$queryRaw` for simple reads that Prisma can express.

---

## API Boundary (`packages/shared`)

- HTTP request/response types shared by mobile and api live in `packages/shared`, imported as `@workspace/shared`.
- Prefer `import type { ... } from "@workspace/shared"` in app code.
- Do not put app code, NestJS services, React components, or runtime framework code in `packages/shared` — types and contract schemas only.
- Do not duplicate API contract types in `apps/mobile` and `apps/api` — one definition in `packages/shared`.

---

## Expected Workflow

### Implementing a mobile feature

1. Screen file in `src/app/` — thin, import and render the feature component.
2. Feature component in `src/components/<domain>/` — one component per file.
3. API wrapper in `src/lib/api/<domain>.ts` — typed, uses `apiClient` from `src/lib/axios.ts`.
4. TanStack Query hook in `src/hooks/<domain>/use-<resource>.ts` — calls the API wrapper, never Axios directly.
5. Component calls the hook, handles `isPending` / `isError` / empty state before rendering data.
6. Form validation schema in `src/lib/validations/` using Zod + React Hook Form.
7. Split any component file that grows beyond one clear responsibility.

### Implementing a backend feature

1. Create or reuse a NestJS feature module.
2. Controller: thin, DTO validation, delegate to service.
3. Service: business logic, calls repository.
4. Repository: Prisma calls only.
5. DTOs for all input shapes.
6. Guard all routes with `ClerkGuard` unless it's a public webhook endpoint.
7. Add tests for non-trivial service behavior (`*.spec.ts`).

---

## Verification

Narrowest first:

```bash
npm run typecheck -w mobile
npm run typecheck -w api
npm run build -w api          # prisma generate + nest build
npm run test -w api           # full Jest suite
npm run test -w api -- <pattern>  # single test
```

Full-repo:

```bash
npm run lint
npm run typecheck
npm run build
```

If a command cannot run due to missing deps, blocked network, or missing credentials — say so clearly and provide the command for the user to run.

## Notes

These rules keep the codebase consistent and maintainable. If a request conflicts with these conventions, follow the user's explicit instruction.
