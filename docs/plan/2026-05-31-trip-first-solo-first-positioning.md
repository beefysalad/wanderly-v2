# Trip-First Solo-First Positioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition Wanderly as a trip-first, solo-first, group-capable travel workspace across product, API, mobile, and MVP sequencing.

**Jira:** `WND-18`

**Status:** Completed for documentation/spec positioning. Future implementation work should use this plan as the product direction.

**Architecture:** Trip is the primary product object and home-screen unit. Groups become a collaboration layer that can be attached to an existing trip, while budget, AI itinerary generation, and expenses all work for solo trips before group-specific splitting is introduced.

**Tech Stack:** Expo React Native, Expo Router, NestJS, Prisma, PostgreSQL, Clerk, TanStack Query, NativeWind.

---

## Product Decision Summary

Wanderly should open on **Your Trips**, not a default group hero. The primary action is **New trip**. The secondary action is **Join trip/group**. A trip card can represent a solo trip or a group trip, and group affordances appear only when the trip has collaborators or when the user chooses to share/collaborate.

AI planning starts inside a Trip workspace. It writes generated activities and budget estimates into the Trip, then returns the user to that same workspace. Group members collaborate only when the Trip is attached to a group.

Budget starts as a solo trip budget, actual expense tracker, trip spend summary, and category totals. Group splitting, payment proof, confirmation, balance summaries, and settle-up flows are layered on after collaboration exists. The shared base is unchanged: every expense belongs to a Trip.

## Files Covered By This Positioning Pass

- Modify: `docs/product-spec.md`
  - Reorder feature tiers so Trips come before Collaboration & Sharing.
  - Rename Groups to Collaboration & Sharing and make groups secondary to trips.
  - Rewrite AI itinerary generation as Trip workspace output.
  - Rewrite Budget as solo base plus group splitting.
  - Rewrite mobile Home as Your Trips with mixed solo/group cards.
  - Update MVP build order so trips and solo creation/detail ship before collaboration.
- Create: `docs/plan/2026-05-31-trip-first-solo-first-positioning.md`
  - Capture implementation implications and acceptance criteria for future agents.

## In Scope

- Product-spec documentation only.
- Positioning, scope, flow, and build-order changes.
- Clear downstream guidance for future API/mobile implementation.

## Out of Scope

- No app code changes.
- No Prisma migration.
- No API contract changes.
- No npm commands.
- No commits or pushes.

## Implementation Tasks

### Task 1: Reframe Feature Tiers

- [x] Move Trips ahead of Groups in `docs/product-spec.md`.
- [x] Rename Groups to Collaboration & Sharing.
- [x] State that a solo trip is the default product path.
- [x] State that groups are attached when collaboration is needed.
- [x] Keep group join code, deep link, roles, member management, and group ownership in MVP, but position them as secondary collaboration features.

### Task 2: Rewrite Trip And Group Semantics

- [x] Define `groupId` as optional and not requested by default during trip creation.
- [x] Add "Attach trip to group" as an MVP capability.
- [x] Mark RSVP as group-trip-only.
- [x] Keep multiple trips per group, but clarify that Trips remain the top-level home surface.
- [x] Preserve the decision to avoid in-app group chat and rely on Messenger/WhatsApp for conversation.

### Task 3: Rewrite AI Flow Around Trip Workspace

- [x] Start itinerary generation from an existing Trip workspace.
- [x] Include destination, dates, budget, interests, travel style, pace, and optional group size as AI inputs.
- [x] Keep `POST /ai/itinerary` as the backend generation endpoint.
- [x] Specify that Claude output becomes Trip `Activity` rows.
- [x] Specify that users return to the Trip workspace after generation.
- [x] Clarify that group members collaborate on AI output only when the trip is attached to a group.

### Task 4: Rewrite Budget And Expense Positioning

- [x] Move the single Trip budget field to the top of Expenses & Budget.
- [x] Add solo expense tracking as an MVP base case.
- [x] Add trip spend summary and category totals for solo trips.
- [x] State that every expense belongs to a Trip as the shared solo/group base.
- [x] Mark expense splitting, custom split notes, QR proof, payment confirmation, payment logs, debt simplification, and per-person balance summaries as group-trip-only.
- [x] Keep planned expenses out of MVP.
- [x] Preserve PHP-first and multi-currency-later guidance.

### Task 5: Rewrite Mobile Home Flow

- [x] Change Home from solo trips plus group list to **Your Trips**.
- [x] Show mixed solo/group trip cards.
- [x] Make **New trip** the primary CTA.
- [x] Make **Join trip/group** the secondary CTA.
- [x] Add Trip Detail flow with Activities, Expenses + Budget, AI Plan, and Share / Collaborate.
- [x] State that Home must not default to a group hero.

### Task 6: Update Architecture Notes

- [x] Rename API route grouping from Groups to Groups / Collaboration.
- [x] Add `POST /trips/:id/attach-group { groupId }` as the trip-to-group attachment route.
- [x] Clarify in Prisma comments that `groupId` upgrades a solo trip into a collaborative workspace.
- [x] Keep existing schema direction intact until implementation work begins.

### Task 7: Update MVP Build Order

- [x] Put Trips module before Groups + Members.
- [x] Put Activities and AI generation after Trips and before collaboration.
- [x] Put mobile Your Trips, New trip, Trip detail, Activity screens, AI Plan, and solo budget before group screens.
- [x] Move group splitting and payment settlement after trip collaboration attachment.
- [x] Keep notifications, upload, push, and admin after the core trip and collaboration flows.

## Acceptance Criteria

- `docs/product-spec.md` describes Wanderly as trip-first and solo-first.
- Groups are consistently framed as Collaboration & Sharing after Trips.
- AI generation targets the Trip workspace, not a group-first workspace.
- Budget works for solo trips before group splitting appears.
- Mobile Home is **Your Trips** with mixed solo/group cards.
- MVP build order starts with trips and solo trip detail before collaboration.
- No app code, package files, lockfiles, or environment files are modified by this positioning pass.

## Verification

Run documentation checks by inspection:

```bash
git diff -- docs/product-spec.md docs/plan/2026-05-31-trip-first-solo-first-positioning.md
```

Expected result:

- Only the two documentation files above appear in the diff for this task.
- Product spec has no remaining group-first Home language.
- MVP build order places Trips and solo mobile flows before Groups, collaboration attachment, and group splitting.

Optional repo check:

```bash
git status --short
```

Expected result:

- `docs/product-spec.md` is modified.
- `docs/plan/2026-05-31-trip-first-solo-first-positioning.md` is untracked.
- Any unrelated pre-existing changes remain untouched.
