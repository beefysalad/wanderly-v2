# WND-7 Trips API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the NestJS Trips API module for solo trips, group trips, trip attachment, and trip RSVP.

**Architecture:** Use the existing controller -> service -> repository pattern from `users`. Controllers stay thin and use Zod DTOs. Services own authz and business decisions. Repositories are the only layer that calls Prisma. Shared HTTP contract types live in `packages/shared`.

**Tech Stack:** NestJS, Prisma, PostgreSQL, Clerk guard, Zod, Jest, `@workspace/shared`.

---

## v1 Review

- v1 implemented trips under group routes only: `/api/groups/[groupId]/trips`.
- Useful v1 pattern: verify group membership before creating or mutating group trips.
- Do not port v1 shape as-is: v1 had no solo trips, used Firebase sync, pushed socket/notification side effects from trip services, and supported statuses that v2 intentionally removed.
- v2 must be trip-first: `Trip.groupId` is nullable, `GET /trips` returns solo trips plus group trips, and collaboration is attached only when needed.

## Files

- Create: `apps/api/src/trips/dto/trip.dto.ts`
- Create: `apps/api/src/trips/trips.controller.ts`
- Create: `apps/api/src/trips/trips.controller.spec.ts`
- Create: `apps/api/src/trips/trips.module.ts`
- Create: `apps/api/src/trips/trips.repository.ts`
- Create: `apps/api/src/trips/trips.service.ts`
- Create: `apps/api/src/trips/trips.service.spec.ts`
- Create: `packages/shared/api/trips.d.ts`
- Modify: `apps/api/src/app.module.ts`
- Modify: `packages/shared/index.d.ts`

## Tasks

### Task 1: Shared Contracts And DTOs

- [x] Add shared trip and RSVP response/request types.
- [x] Export shared trip types from `packages/shared/index.d.ts`.
- [x] Add Zod DTO schemas for create/update/attach/RSVP request bodies.
- [x] Validate API body status values as lowercase for HTTP input while persisting uppercase Prisma enum values.

### Task 2: Service Tests First

- [x] Write service tests for solo trip creation.
- [x] Write service tests for group trip membership validation.
- [x] Write service tests for `GET /trips` returning current user's solo and group trips.
- [x] Write service tests for denying group trip access to non-members.
- [x] Write service tests for upserting RSVP.
- [x] Write service tests for attaching a solo trip to a group.
- [x] Run `npm run test -w api -- trips.service.spec.ts` and confirm RED.

### Task 3: Trips Repository And Service

- [x] Implement repository methods for current user lookup, membership lookup, trip CRUD, trip listing, group listing, attach group, and RSVP upsert.
- [x] Implement service authorization and business rules.
- [x] Keep delete restricted to the trip creator.
- [x] Run `npm run test -w api -- trips.service.spec.ts` and confirm GREEN.

### Task 4: Controller And Module

- [x] Add controller endpoints from WND-7 plus `POST /trips/:id/attach-group`.
- [x] Add controller unit tests for route delegation and `204` delete metadata.
- [x] Register `TripsModule` in `AppModule`.
- [x] Run controller tests.

### Task 5: Verification

- [x] Run `npm run test -w api -- trips`.
- [x] Run `npm run typecheck -w api`.
- [x] Run `npm run build -w api`.
- [x] Run `npm run typecheck -w @workspace/shared`.
- [x] Run `git diff --check`.
