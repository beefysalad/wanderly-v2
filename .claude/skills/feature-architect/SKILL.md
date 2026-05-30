---
name: feature-architect
description: Use when the user wants to think through, spec, plan, or create Jira tickets for a new Wanderly feature, screen, or API capability — before any implementation. Maps the current system, brainstorms the approach, writes a lightweight spec in docs/plan/, and opens a Jira ticket in WND.
---

# Feature Architect

Turn a Wanderly feature idea into a concrete plan and a Jira work item.
This skill covers: understanding the current system → brainstorming → writing a spec/plan → creating the Jira ticket.
Do not jump to implementation; finish the plan first and confirm with the user.

## Workflow

Track the run with `TodoWrite` (five items). Do them in order.

1. Map the current system
2. Brainstorm and settle the direction
3. Write the feature plan
4. Create the Jira ticket in `WND`
5. Final report

---

## 1. Map the current system

Inspect what already exists before proposing anything. For broad sweeps, dispatch the **`Explore`** subagent to keep the main thread clean; read targeted files directly when you know where to look.

Inspect what applies:

- `CLAUDE.md`, `AGENTS.md` — repo conventions and guardrails
- `docs/product-spec.md` — the authoritative feature spec and MVP scope
- `apps/api/prisma/schema.prisma` — data model (source of truth for all entities)
- `packages/shared/` — shared HTTP contract types (`@workspace/shared`)
- `apps/api/src/<module>/` — NestJS controllers, services, repositories, DTOs
- `apps/mobile/src/app/` — Expo Router screen structure
- `apps/mobile/src/hooks/` — TanStack Query hooks
- `apps/mobile/src/lib/api/` — Axios API wrappers
- `apps/mobile/src/components/` — UI components

Capture: existing data models, API routes, screen flows, hook patterns, and any gaps or constraints relevant to the feature.

---

## 2. Brainstorm and settle the direction

Brainstorm **before** proposing any design — this prevents a clean implementation of the wrong thing.

**If the feature existed in Wanderly v1**, dispatch the **`v1-expert`** subagent first:
- Ask it: "How did v1 implement X? What was good, what was bad, and should v2 port it?"
- Carry its verdict into the brainstorm — don't just copy v1's approach, question it.
- Reference real v1 file paths in the plan doc when relevant.

Explore the problem space and surface the key questions:

- Does this need a new Prisma model, or can it extend an existing one?
- Does it affect solo trips, group trips, or both?
- What does the API contract look like — new endpoint or extension of an existing one?
- What screen(s) does this touch or create?
- What TanStack Query cache keys are affected?
- What notifications, if any, does this trigger?
- Is this MVP scope or V2? (reference `docs/product-spec.md`)

Use `AskUserQuestion` for genuine forks the user must decide. Converge on a short decision record — **Decision / Why / Assumptions / Open questions** — and get the user's approval before writing any docs.

---

## 3. Feature plan

Create `docs/plan/<feature-slug>-plan.md`.

```markdown
# <Feature> Plan

Last updated: YYYY-MM-DD
Status: Draft
Jira: WND-<key> (added in step 4)
```

Include:

**Scope** — what is and isn't included in this ticket.

**Data model changes** — new models, new fields, or migrations needed. Reference actual model names from `schema.prisma`.

**API changes** — new or modified NestJS routes. Format:
```
POST /trips/:tripId/rsvp   { status: 'going'|'maybe'|'not_going' }
```
Include the module (`trips`, `groups`, `expenses`, etc.) and the service/repository methods needed.

**Mobile changes** — screens created or modified, hooks added or updated, components needed.

**Implementation phases** — break into discrete steps that can be PRs:
- Phase 1: Prisma schema + migration
- Phase 2: NestJS module (controller → service → repository)
- Phase 3: Shared types in `@workspace/shared`
- Phase 4: Mobile — hooks + API wrapper
- Phase 5: Mobile — UI screens/components

**Verification commands**:
```bash
npm run typecheck -w api
npm run build -w api
npm run typecheck -w web
npm run dev -w mobile
```

**Open questions** — anything unresolved.

---

## 4. Jira ticket

**Wanderly Jira config** (do not guess):

- **Site**: `projectzeusstartup.atlassian.net`
- **cloudId**: `4ee4c781-8a46-4e9d-b98c-493fe7ffed03`
- **Project**: `WND` (Wanderly)
- **Issue types**: Epic · Feature · Story · Task · Bug — use the most appropriate one
- Before creating, search with `mcp__atlassian__searchJiraIssuesUsingJql` for an existing open ticket covering the same feature; reference it instead of duplicating.
- Create with `mcp__atlassian__createJiraIssue`.

### Issue type guide

| Work | Type |
|---|---|
| Large cross-cutting capability (auth, expenses, AI) | Epic |
| Discrete product capability with user-facing outcome | Feature |
| A specific user-facing behavior or screen | Story |
| Backend-only work, refactor, migration | Task |
| Something broken | Bug |

### Ticket format

**Summary**: `[<Domain>] <What gets built> — <user outcome>`

Examples:
- `[Expenses] Debt simplification (settle up) — show who owes whom after splitting`
- `[Auth] Clerk onboarding flow — name + optional photo on first login`
- `[AI] Itinerary generation screen — full trip schedule from a single prompt`

**Description** (markdown):

```
## What
<1-2 sentence plain-language description of what this builds>

## Why
<The pain point it solves — reference the Filipino friend group use case where relevant>

## Scope
<What's included and what's explicitly not included>

## API changes
<Routes added or modified>

## Data model
<Prisma models added or changed>

## Mobile screens/components
<Screens or components created or updated>

## Acceptance criteria
- [ ] <specific, testable criterion>
- [ ] <specific, testable criterion>
- [ ] <specific, testable criterion>

## Docs
Plan: docs/plan/<feature-slug>-plan.md
Spec: docs/product-spec.md
```

**Labels**: include the domain (`auth`, `groups`, `trips`, `activities`, `expenses`, `ai`, `notifications`, `profile`) + `mobile`, `api`, and `mvp` or `v2` based on the spec tier.

---

## 5. Final report

End with:
- The plan doc path
- The Jira ticket key + URL (`WND-<key>`)
- Any unresolved questions or assumptions
- Suggested next step (which phase to implement first)

If the Atlassian MCP is unavailable, write the ticket as a ready-to-paste markdown block in the plan doc and state clearly that Jira creation was blocked.
