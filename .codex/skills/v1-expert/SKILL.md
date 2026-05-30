---
name: v1-expert
description: Use when you need to understand how Wanderly v1 implemented a feature, compare v1 to v2, decide whether a v1 pattern should be ported, or inspect the old travelscheduleapp code before designing or implementing v2 mobile/backend behavior.
---

# Wanderly v1 Expert

Use this skill as a critical consultant for the Wanderly v1 web app located at:

```text
/Users/jpatrickzxc/Documents/coding/travelscheduleapp
```

Do not answer from memory. Read the actual v1 files before making claims.

## Job

When asked about v1:

1. Read the relevant v1 code.
2. Give an honest assessment. v1 was a learning project; not every pattern is worth preserving.
3. Answer the specific question: how v1 did it, whether to port it, or how to redesign it for v2.
4. Recommend the v2 location and shape using this repo's boundaries.

Act as a consultant, not a copier. The goal is for v2 mobile/backend to be better than v1, not identical.

## V1 Codebase Map

```text
/Users/jpatrickzxc/Documents/coding/travelscheduleapp/
├── src/
│   ├── app/
│   │   ├── api/                          # Next.js API routes
│   │   │   ├── groups/                   # Groups, join, validate-code
│   │   │   │   └── [groupId]/
│   │   │   │       ├── trips/            # Trip CRUD per group
│   │   │   │       ├── member-tasks/     # Not porting to v2
│   │   │   │       └── guest/            # Not porting to v2
│   │   │   ├── trips/[tripId]/
│   │   │   │   ├── activities/           # Activity CRUD + services
│   │   │   │   ├── expenses/             # Expense CRUD + payments + confirm
│   │   │   │   ├── budgets/              # Separate Budget model, changed in v2
│   │   │   │   ├── payment-logs/         # PaymentLog CRUD
│   │   │   │   └── export/ics/           # ICS calendar export
│   │   │   ├── notifications/
│   │   │   ├── profile/
│   │   │   ├── sync/                     # Firebase sync, replaced by Clerk webhook
│   │   │   ├── upload/image/             # Cloudinary upload
│   │   │   └── admin/
│   │   ├── group/[groupId]/
│   │   │   └── trip/[tripId]/
│   │   │       ├── activities/
│   │   │       ├── budget/
│   │   │       └── expenses/
│   │   ├── guest/                        # Not porting
│   │   ├── dashboard/
│   │   ├── notifications/
│   │   └── profile/
│   ├── hooks/                            # TanStack Query hooks, useful reference
│   │   ├── useActivities.ts
│   │   ├── useBudgets.ts
│   │   ├── useCurrentUser.ts
│   │   ├── useExpenses.ts
│   │   ├── useGroups.ts
│   │   ├── useGuest.ts                   # Not porting
│   │   ├── useMemberTasks.ts             # Not porting
│   │   ├── useNotifications.ts
│   │   ├── useProfile.ts
│   │   ├── useSocket.ts
│   │   ├── useSocketGroupUpdates.ts
│   │   ├── useSocketNotifications.ts
│   │   └── useTrips.ts
│   └── shared/types/index.ts
├── prisma/schema.prisma
├── AI_CONTEXT.md
└── API_REFERENCE.md
```

## Known V2 Direction

Always check `docs/product-spec.md` in this v2 repo for the authoritative product direction. Use this table as a quick guardrail:

| V1 | V2 Direction | Reason |
|---|---|---|
| Firebase Auth + Admin SDK | Clerk | Simpler auth, OAuth/Apple, webhook-driven user sync |
| Guest read-only mode | Removed | Adds auth complexity and weakens retention |
| Email invites | Removed | Join code + later deep link is enough |
| Separate `Budget` model | Expense model handles planned/actual, or simpler MVP budget field depending current spec | Simpler schema |
| Owner/Admin/Member | Re-check spec; simplify unless admin is explicitly required | Avoid role complexity |
| `MemberTask` model | Not carried over | Out of scope |
| `/api/v1/gateway` proxy | Removed | Adds little security value |
| `x-admin-password` | Clerk-backed auth/roles | Proper auth |
| Firebase `/api/sync` | Clerk webhook | No manual sync endpoint |
| Guest expense fields like `tempPaidBy` / `tempName` | Removed | v2 requires real accounts |

If the table and `docs/product-spec.md` disagree, trust the current v2 product spec and mention the discrepancy.

## How To Inspect A V1 Feature

For "how did v1 implement X?", read at least:

- The v1 service file, usually where business logic lives.
- The v1 route file for API shape and error handling.
- The v1 hook for client data flow.
- `prisma/schema.prisma` for the data model.
- `AI_CONTEXT.md` or `API_REFERENCE.md` only when useful for orientation.

Prefer `rg` to locate files quickly:

```bash
rg "join|validate-code|expense|payment|activity" /Users/jpatrickzxc/Documents/coding/travelscheduleapp/src
```

## Assessment Criteria

When asked whether to port a v1 feature, evaluate:

1. Does it solve a real Wanderly friend-group travel pain point?
2. Is the v1 implementation correct? Look for missing auth, weak error handling, direct DB calls in routes, race conditions, untyped `any`, guest-mode coupling, and nullable fields created by old compromises.
3. Is the data model clean enough to preserve?
4. Does v2's simpler model already cover the use case?
5. Is the feature MVP, V2, or V3 according to `docs/product-spec.md`?

Be direct. "Do not port this pattern" is valid when v1 is carrying bad complexity.

## V2 Placement Guidance

Map recommendations to this repo:

- Backend feature: `apps/api/src/<feature>/`.
- Backend contracts shared with clients: `packages/shared`.
- Mobile product UI: `apps/mobile`.
- Web dashboard/admin UI: `apps/web`.
- Shared web UI only: `packages/ui`.

Follow `AGENTS.md` before suggesting implementation details.

## Output Format

Always answer with:

1. **What v1 does**: include concrete v1 file references.
2. **What is useful**: patterns or logic worth reusing.
3. **What is bad or risky**: technical debt, auth gaps, data-model issues, coupling.
4. **Recommendation for v2**: port as-is, port with changes, redesign, do not port, or already handled differently.
5. **Relevant v2 files**: where the v2 implementation should live.

If you cannot access the v1 path, say that explicitly and do not invent details.
