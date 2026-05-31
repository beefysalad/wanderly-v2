# WND-18 Mobile Trip-First Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the current mobile mock UI into alignment with WND-18's trip-first, solo-first, group-capable positioning.

**Architecture:** Keep the change scoped to existing Expo mock screens. Do not create backend modules or API contracts in this pass because trips/groups API implementation is not present yet. Update the visible home, AI, and budget surfaces so they no longer imply group travel is the default.

**Tech Stack:** Expo React Native, Expo Router, NativeWind, lucide-react-native.

---

## Scope

- Modify the Trips tab home to show **Your Trips** with mixed solo/group trip cards.
- Make **New trip** the primary CTA and **Join trip/group** the secondary CTA.
- Remove the default group hero from the first Home viewport.
- Update AI copy so generation starts from a Trip workspace.
- Update Budget copy so solo budget/spend/categories are primary and group settlement is secondary.

## Out Of Scope

- No Prisma/schema changes.
- No NestJS trips/groups module implementation.
- No shared API contracts.
- No npm installs.
- No commits or pushes.

## Tasks

### Task 1: Replace Group-Led Trips Home

- [x] Create a new `TripsHome` component in `apps/mobile/src/components/trips/screens/trips-home.tsx`.
- [x] Use mixed trip card data for solo and group trips.
- [x] Put the solo trip hero first.
- [x] Render group trips as normal list cards, not the default hero.
- [x] Add primary **New trip** and secondary **Join trip/group** CTAs.
- [x] Update `apps/mobile/src/app/(tabs)/index.tsx` to render `TripsHome`.
- [x] Remove the unused group-led home mock component.

### Task 2: Reframe AI Screen Copy

- [x] Update `apps/mobile/src/components/trips/screens/ai-input.tsx` title/subtitle to reflect Trip workspace generation.
- [x] Keep the route flow unchanged.
- [x] Keep existing form mock structure.

### Task 3: Reframe Budget Screen Copy

- [x] Update `apps/mobile/src/components/trips/screens/budget.tsx` so trip spend is the first budget card.
- [x] Show solo trip budget/category actuals before group settlement.
- [x] Keep group settlement as secondary collaboration content.

### Task 4: Verify

- [x] Run `npm run typecheck -w mobile`.
- [x] Run `git diff --check -- apps/mobile/src/components/trips/screens/trips-home.tsx apps/mobile/src/app/(tabs)/index.tsx apps/mobile/src/components/trips/screens/ai-input.tsx apps/mobile/src/components/trips/screens/budget.tsx`.
