# Wanderly — Product Spec

> **Stack**: Expo React Native · NestJS · Clerk · Prisma · PostgreSQL · Claude API
> **Last updated**: May 2026

---

## Feature Tiers

| Tier | Meaning |
|---|---|
| 🟢 MVP | Must ship at launch |
| 🟡 V2 | Ship within first few months |
| 🔵 V3 | Future / nice to have |

---

## 1. Auth & Onboarding

| Feature | Tier | Notes |
|---|---|---|
| Sign up / Sign in (email + password) | 🟢 | Clerk |
| Google OAuth | 🟢 | Clerk |
| Apple Sign In | 🟢 | Required for iOS App Store |
| Onboarding flow (name, travel style, interests) | 🟢 | 3-step. Step 1: name + optional photo. Step 2: travel style (Budget/Mid-range/Luxury). Step 3: interests multi-select. All saved in one PATCH call at completion |
| Push notification opt-in | 🟢 | Ask after first group join or first expense, not cold during onboarding |
| Biometric unlock (Face ID / Touch ID) | 🔵 | Polish, not MVP |

---

## 2. Groups

| Feature | Tier | Notes |
|---|---|---|
| Create group (name, emoji, color) | 🟢 | |
| Unique 6-char join code | 🟢 | |
| Join group via code | 🟢 | |
| Join group via deep link | 🟢 | `wanderly://join/ABC123` — Filipino users share links in Messenger/Viber, not type codes |
| Member roles (Owner, Member) | 🟢 | Owner can edit group, remove members, delete group. No Admin tier — adds complexity without solving a real user problem |
| Remove member (owner only) | 🟢 | |
| Leave group | 🟢 | |
| Delete group (owner only) | 🟢 | |
| Edit group details | 🟢 | |
| Group chat | 🔵 | Will not beat WhatsApp/Messenger. Wanderly is the structured layer on top of those apps, not a replacement |
| Real-time member presence | 🔵 | No functional value without chat |
| Open/public groups | 🔵 | Different product entirely |

> **Positioning**: Wanderly does itineraries, budgets, and splitting. WhatsApp handles the banter. Complementary, not competing.

---

## 3. Trips

Users can have **solo trips** (no group) or **group trips**. A solo trip is just a Trip with no group attached — plan alone first, create a group and link it later if needed.

| Feature | Tier | Notes |
|---|---|---|
| Create trip (name, dates, destination) | 🟢 | `groupId` is optional — supports solo trips |
| Solo trip mode | 🟢 | No group required. Natural acquisition loop: plan solo → invite friends → create group |
| Trip statuses: Planning / Completed / Cancelled | 🟢 | 3 statuses only. No "Finalized" (no clear owner), no "Ongoing/Active" (unnecessary state) |
| Multiple trips per group | 🟢 | |
| Edit / delete trip | 🟢 | |
| "Who's in?" RSVP per trip | 🟢 | Per-member status: Going / Maybe / Can't make it. Prevents planning for people who won't show up |
| Trip templates (save & clone) | 🟡 | V2 retention feature — needs completed trips first |
| Pre-departure checklist (AI gap scan) | 🟡 | V2 — needs validated itinerary usage first |
| Post-trip recap (AI summary) | 🟡 | V2 — needs completed trips |
| Export schedule as ICS | 🟡 | V2 — low priority for the core market |
| Trip wishlist / bucket list | 🔵 | |

> **Cut**: PNG export — removed. ICS export demoted to V2 (Filipino friend groups screenshot to Messenger, not sync to Google Calendar).

---

## 4. Activities (Itinerary)

| Feature | Tier | Notes |
|---|---|---|
| Add activity (title, date, time range, notes, location) | 🟢 | |
| Transportation details (mode, pickup/dropoff, time) | 🟢 | Keep structured fields. Simplify the creation form — show transport fields only when relevant |
| Mark activity as done | 🟢 | |
| Edit / delete activity | 🟢 | |
| Calendar view | 🟢 | |
| List / schedule view | 🟢 | |
| AI itinerary generation | 🟢 | **Hero feature.** Full itinerary in 30 seconds. This is the "wow" moment that differentiates Wanderly from a GSheet |
| Drag to reorder activities | 🟢 | Core UX, not polish. Anyone who's reordered GSheet rows knows the pain |
| Group voting on proposed activities | 🟡 | V2 — the "saan tayo" debate is real but voting infra is non-trivial |
| Attach photo to activity | 🟡 | V2 — photos go to Messenger anyway |
| Nearby suggestions while on trip | 🔵 | |

---

## 5. Expenses & Budget

| Feature | Tier | Notes |
|---|---|---|
| Add expense (amount, description, category, date) | 🟢 | |
| Expense categories (accommodation, food, transport, activities, other) | 🟢 | |
| Split evenly among selected members | 🟢 | |
| Split by custom amounts | 🟢 | Promoted from V2 — not all trips are equal-split situations |
| Notes/context per split | 🟢 | Reduces the "bakit ganun kalaki?" Messenger argument |
| Payment methods (Cash, Bank Transfer, Maya, GCash) | 🟢 | PH-focused |
| QR code upload for payment proof | 🟢 | GCash/Maya QR sharing is how Filipino users settle debts |
| Payment confirmation flow (submit → confirm/reject) | 🟢 | Digital "pakita mo screenshot" |
| Payment history log | 🟢 | |
| Debt simplification (settle up) | 🟢 | Promoted from V2 — core value of expense splitting. A owes B, B owes C → A pays C directly |
| Per-person balance summary (text-based) | 🟢 | Who owes whom, how much. Plain text list, not a chart |
| Single total budget field on Trip | 🟢 | Simple "budget: ₱5,000 per head" instead of itemized planned expenses |
| Split by percentage | 🟡 | V2 — less common than custom amounts |
| Budget vs actual tracking per category | 🟡 | V2 |
| Budget alerts (80% spent push) | 🟡 | V2 |
| Per-trip expense breakdown chart | 🟡 | V2 — text summary ships first |
| Multi-currency support | 🟡 | V2 — add when international trip usage is confirmed. PHP only at launch |
| AI expense categorization | 🟡 | V2 — low friction gain, adds latency |
| Receipt scanning (photo → expense) | 🟡 | V2 — real value, high Vision LLM complexity |

> **Cut**: PLANNED expense type removed from MVP. Budget is a single field on Trip. Expense tracking is actuals only at launch. `ExpenseType` enum not needed until V2 budget forecasting.
> **Cut**: Split by percentage, multi-currency for MVP.

---

## 6. AI Features

| Feature | Tier | Model | Notes |
|---|---|---|---|
| Itinerary generation | 🟢 | Claude Sonnet | Hero feature. Prompt → structured Activity rows |
| Budget estimation | 🟢 | Claude Sonnet | Pairs with itinerary: "Estimated ₱8,500/person for 4 days in Palawan" |
| Pre-departure gap check | 🟡 | Claude Sonnet | V2 — scans itinerary for missing transfers, accommodation gaps |
| AI packing list | 🟡 | Claude Sonnet | V2 — "You're going surfing in Siargao, here's what to pack." Highly shareable to group chat |
| Post-trip recap | 🟡 | Claude Sonnet | V2 — needs completed trips |
| Expense auto-categorization | 🟡 | Claude Sonnet | V2 — low value, adds latency |
| Receipt scanning | 🟡 | Claude Sonnet (vision) | V2 |
| Destination recommendations | 🔵 | Claude Sonnet | V3 — needs behavioral data |

### Itinerary generation flow

1. User fills: destination, dates, group size, budget, interests, travel style (collected here, not onboarding)
2. NestJS `POST /ai/itinerary` calls Claude Sonnet with structured system prompt
3. Claude returns JSON array of activities (day, time, title, location, notes, estimated cost, category)
4. Backend validates with Zod, bulk-inserts as `Activity` rows
5. Group sees a fully-populated itinerary they can edit and reorder

---

## 7. Notifications

| Feature | Tier | Notes |
|---|---|---|
| In-app notification center | 🟢 | |
| Push notifications (Expo) | 🟢 | |
| New expense added | 🟢 | |
| Payment request received | 🟢 | |
| Payment confirmed / rejected | 🟢 | |
| New member joined group | 🟢 | |
| Trip status changed | 🟢 | |
| RSVP status changed | 🟢 | Someone confirmed / dropped out |
| Pre-trip reminder (3 days before) | 🟡 | Fast V2 — one scheduled job, high engagement value |
| Budget alert (80% spent) | 🟡 | V2 |
| Activity updated | 🟡 | V2 — can generate notification storms without batching |

---

## 8. Profile & Settings

| Feature | Tier | Notes |
|---|---|---|
| Edit profile (name, photo, bio) | 🟢 | |
| Travel style + interests | 🟢 | Collected at first AI use, editable from profile |
| Past trips summary (solo + group) | 🟢 | |
| Change password | 🟢 | Clerk |
| Delete account | 🟢 | Clerk + DB cascade |
| Dark mode | 🟡 | V2 — affects perceived quality, fast follow |
| Language / locale | 🔵 | Cut — target market is English-comfortable Filipino users |

---

## 9. Sharing

| Feature | Tier | Notes |
|---|---|---|
| Text-based trip summary | 🟢 | Paste-ready for Messenger/Viber: trip name, dates, destination, key activities, per-person cost estimate |
| ICS calendar export | 🟡 | V2 |

> **Cut**: PNG/image export removed. Text summary is zero infra, instantly shareable to any chat app.

---

## 10. Discovery (V3 — deprioritised entirely)

Not in MVP or V2. Wanderly v1 is a **private coordination tool**. Discovery is a different product.

---

---

# Architecture

---

## Monorepo Structure

```
wanderly-v2/
├── apps/
│   ├── mobile/          # Expo React Native (Expo Router, SDK 56) — primary product
│   ├── web/             # Next.js App Router — web dashboard / admin
│   └── api/             # NestJS backend
├── packages/
│   ├── shared/          # @workspace/shared — HTTP contract types (type-only)
│   ├── ui/              # @workspace/ui — shared shadcn/ui components (web only)
│   ├── eslint-config/
│   └── typescript-config/
├── turbo.json
└── package.json         # npm workspaces root
```

---

## Backend — NestJS (`apps/api`)

### Module structure

```
apps/api/src/
├── main.ts
├── app.module.ts
├── common/
│   ├── guards/
│   │   └── clerk.guard.ts
│   └── decorators/
│       └── current-user.decorator.ts
├── webhooks/
│   └── clerk-webhook.controller.ts   # user.created / user.deleted
├── users/
├── groups/
├── trips/
├── activities/
├── expenses/
├── notifications/
├── upload/                            # Cloudinary
└── ai/
    ├── ai.module.ts
    ├── ai.service.ts
    ├── ai.controller.ts
    └── prompts/
        ├── itinerary.prompt.ts
        └── budget-estimate.prompt.ts
```

### Auth flow

```
Mobile (Expo)
  → Clerk signs user in → JWT stored in SecureStore
  → Every API request: Authorization: Bearer <clerk_jwt>

NestJS ClerkGuard
  → Verifies JWT via Clerk JWKS (stateless, no DB hit)
  → Extracts clerkId from token sub claim

Clerk Webhook (user.created / user.deleted)
  → POST /webhooks/clerk → verified via svix
  → Creates / deletes User row in Postgres
```

### Full API routes

```
# Webhook (no auth)
POST  /webhooks/clerk

# ClerkGuard required on all below

# Users
GET   /users/me
PATCH /users/me
DELETE /users/me

# Groups
GET   /groups
POST  /groups
GET   /groups/:id
PATCH /groups/:id
DELETE /groups/:id
POST  /groups/join                       { code }
POST  /groups/:id/leave
GET   /groups/:id/members
DELETE /groups/:id/members/:userId

# Trips (groupId optional — solo trips have no group)
GET   /trips                             user's trips (solo + group)
POST  /trips
GET   /trips/:id
PATCH /trips/:id
DELETE /trips/:id
GET   /groups/:groupId/trips             trips for a specific group

# Trip RSVP
GET   /trips/:id/rsvp
PATCH /trips/:id/rsvp                    { status: 'going'|'maybe'|'not_going' }

# Activities
GET   /trips/:tripId/activities
POST  /trips/:tripId/activities
PATCH /trips/:tripId/activities/:id
DELETE /trips/:tripId/activities/:id
PATCH /trips/:tripId/activities/reorder  { orderedIds: string[] }

# Expenses
GET   /trips/:tripId/expenses
POST  /trips/:tripId/expenses
GET   /expenses/:id
PATCH /expenses/:id
DELETE /expenses/:id
POST  /expenses/:id/splits/:userId/submit
POST  /expenses/:id/splits/:userId/confirm
GET   /trips/:tripId/balance             per-person balance summary + settle up
GET   /trips/:tripId/payment-logs

# Notifications
GET   /notifications
GET   /notifications/unread-count
POST  /notifications/:id/read
POST  /notifications/read-all

# Upload
POST  /upload/image

# AI
POST  /ai/itinerary
POST  /ai/budget-estimate

# Admin
GET   /admin/users
DELETE /admin/users/:id
GET   /admin/stats
GET   /admin/config
POST  /admin/config
```

---

## Database Schema (Prisma)

```prisma
// ─── Users ───────────────────────────────────────────────────────────────────

model User {
  id          String      @id @default(cuid())
  clerkId     String      @unique
  email       String      @unique
  name        String?
  photoUrl    String?
  bio         String?
  travelStyle TravelStyle @default(BUDGET)
  interests   String[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  groups        GroupMember[]
  trips         Trip[]         @relation("TripCreator")
  tripRsvps     TripRsvp[]
  paidExpenses  Expense[]      @relation("PaidBy")
  splits        ExpenseSplit[]
  notifications Notification[]
}

enum TravelStyle { BUDGET MID_RANGE LUXURY }

// ─── Groups ──────────────────────────────────────────────────────────────────

model Group {
  id          String   @id @default(cuid())
  name        String
  code        String   @unique
  colorScheme String   @default("orange")
  emoji       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  members GroupMember[]
  trips   Trip[]
}

model GroupMember {
  id       String     @id @default(cuid())
  groupId  String
  userId   String
  role     MemberRole @default(MEMBER)
  joinedAt DateTime   @default(now())

  group Group @relation(fields: [groupId], references: [id], onDelete: Cascade)
  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([groupId, userId])
}

enum MemberRole { OWNER MEMBER }

// ─── Trips ───────────────────────────────────────────────────────────────────
// groupId is optional — null means solo trip

model Trip {
  id          String     @id @default(cuid())
  groupId     String?
  createdById String
  name        String
  destination String?
  startDate   DateTime?
  endDate     DateTime?
  status      TripStatus @default(PLANNING)
  currency    String     @default("PHP")
  budget      Decimal?   @db.Decimal(12, 2)  // total trip budget (optional)
  aiGenerated Boolean    @default(false)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  group      Group?     @relation(fields: [groupId], references: [id], onDelete: Cascade)
  creator    User       @relation("TripCreator", fields: [createdById], references: [id])
  activities Activity[]
  expenses   Expense[]
  rsvps      TripRsvp[]
}

enum TripStatus { PLANNING COMPLETED CANCELLED }

// ─── Trip RSVP ───────────────────────────────────────────────────────────────

model TripRsvp {
  id       String     @id @default(cuid())
  tripId   String
  userId   String
  status   RsvpStatus @default(PENDING)
  updatedAt DateTime  @updatedAt

  trip Trip @relation(fields: [tripId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([tripId, userId])
}

enum RsvpStatus { GOING MAYBE NOT_GOING PENDING }

// ─── Activities ──────────────────────────────────────────────────────────────

model Activity {
  id                 String   @id @default(cuid())
  tripId             String
  title              String
  date               DateTime
  startTime          String?
  endTime            String?
  location           String?
  notes              String?
  done               Boolean  @default(false)
  transportationMode String?
  pickupTime         String?
  pickupLocation     String?
  dropoffLocation    String?
  aiSuggested        Boolean  @default(false)
  sortOrder          Int      @default(0)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  trip Trip @relation(fields: [tripId], references: [id], onDelete: Cascade)
}

// ─── Expenses ────────────────────────────────────────────────────────────────

model Expense {
  id            String          @id @default(cuid())
  tripId        String
  paidByUserId  String
  amount        Decimal         @db.Decimal(12, 2)
  currency      String          @default("PHP")
  description   String
  category      ExpenseCategory
  date          DateTime
  paymentMethod PaymentMethod   @default(CASH)
  accountNumber String?
  bankName      String?
  qrImageUrl    String?
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  trip        Trip           @relation(fields: [tripId], references: [id], onDelete: Cascade)
  paidBy      User           @relation("PaidBy", fields: [paidByUserId], references: [id])
  splits      ExpenseSplit[]
  paymentLogs PaymentLog[]
}

enum ExpenseCategory { ACCOMMODATION FOOD TRANSPORTATION ACTIVITIES OTHER }
enum PaymentMethod   { CASH BANK_TRANSFER MAYA GCASH }

model ExpenseSplit {
  id        String        @id @default(cuid())
  expenseId String
  userId    String
  amount    Decimal       @db.Decimal(12, 2)
  notes     String?       // context for why this split amount — reduces group disputes
  status    PaymentStatus @default(PENDING)
  proofUrl  String?       // QR/screenshot payment proof

  expense Expense @relation(fields: [expenseId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id])

  @@unique([expenseId, userId])
}

enum PaymentStatus { PENDING SUBMITTED CONFIRMED REJECTED }

model PaymentLog {
  id            String        @id @default(cuid())
  expenseId     String
  payerUserId   String
  payeeUserId   String
  amount        Decimal       @db.Decimal(12, 2)
  paymentMethod PaymentMethod
  note          String?
  createdAt     DateTime      @default(now())

  expense Expense @relation(fields: [expenseId], references: [id], onDelete: Cascade)
}

// ─── Notifications ───────────────────────────────────────────────────────────

model Notification {
  id        String           @id @default(cuid())
  userId    String
  type      NotificationType
  title     String
  message   String
  read      Boolean          @default(false)
  relatedId String?
  createdAt DateTime         @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum NotificationType {
  MEMBER_JOINED
  RSVP_CHANGED
  EXPENSE_ADDED
  PAYMENT_REQUEST
  PAYMENT_CONFIRMED
  PAYMENT_REJECTED
  TRIP_UPDATED
}

// ─── Admin ───────────────────────────────────────────────────────────────────

model AppConfig {
  key       String   @id
  value     Json
  updatedAt DateTime @updatedAt
}
```

---

## Frontend — Expo React Native (`apps/mobile`)

### File structure

```
apps/mobile/
├── src/
│   ├── app/
│   │   ├── _layout.tsx                # ClerkProvider + QueryClient root
│   │   ├── index.tsx                  # Redirect → (auth) or (tabs)
│   │   ├── (auth)/
│   │   │   ├── _layout.tsx
│   │   │   ├── sign-in.tsx
│   │   │   └── sign-up.tsx
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx            # Bottom tabs
│   │   │   ├── index.tsx              # Home — solo trips + group list
│   │   │   └── profile.tsx
│   │   ├── trip/
│   │   │   └── [tripId]/
│   │   │       ├── index.tsx          # Trip detail — activities
│   │   │       ├── expenses.tsx
│   │   │       └── ai-plan.tsx        # AI itinerary + budget estimate
│   │   └── group/
│   │       └── [groupId]/
│   │           ├── index.tsx          # Group detail + trips list
│   │           └── members.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── groups/
│   │   ├── trips/
│   │   ├── expenses/
│   │   ├── ai/
│   │   └── shared/
│   ├── hooks/
│   │   ├── useCurrentUser.ts
│   │   ├── useGroups.ts
│   │   ├── useTrip.ts
│   │   ├── useActivities.ts
│   │   ├── useExpenses.ts
│   │   ├── useBalance.ts
│   │   ├── useNotifications.ts
│   │   └── useAi.ts
│   ├── lib/
│   │   ├── axios.ts
│   │   ├── auth.ts                    # Clerk token interceptor
│   │   └── api/
│   ├── constants/
│   │   └── theme.ts
│   ├── types/
│   └── global.css
```

### Screen flow

```
Launch
  ↓
Clerk session?
  No  → Sign In / Sign Up → Onboarding (name only, photo optional)
  Yes → Home

Home
  ├── My Solo Trips (trips with no group)
  │     → Trip Detail (Activities | Expenses | AI Plan)
  └── My Groups
        → Group Detail
            → Trip Card → Trip Detail (Activities | Expenses | AI Plan)
            → Members screen (incl. RSVP status per trip)
        → Join group (enter code or tap link)
        → Create group

Profile
  → Edit profile, travel style (set here if not yet), interests
  → Past trips (solo + group)
  → Notification settings
```

### Axios + Clerk token interceptor

```typescript
// src/lib/auth.ts
import { useAuth } from '@clerk/expo';
import { apiClient } from '@/lib/axios';

export function useAuthedClient() {
  const { getToken } = useAuth();
  apiClient.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  return apiClient;
}
```

### ClerkProvider with SecureStore token cache

```typescript
// src/app/_layout.tsx
import { ClerkProvider } from '@clerk/expo';
import * as SecureStore from 'expo-secure-store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const tokenCache = {
  getToken:    (key: string) => SecureStore.getItemAsync(key),
  saveToken:   (key: string, v: string) => SecureStore.setItemAsync(key, v),
  deleteToken: (key: string) => SecureStore.deleteItemAsync(key),
};

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <QueryClientProvider client={queryClient}>
        <Slot />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
```

> `expo-secure-store` needs to be installed: `npm install expo-secure-store -w mobile`

---

## Key Packages

### Mobile (`apps/mobile`)

| Purpose | Package |
|---|---|
| Framework | `expo` ~56, `expo-router` ~56.2 |
| Auth | `@clerk/expo` |
| Secure token storage | `expo-secure-store` |
| Data fetching | `@tanstack/react-query` v5 |
| HTTP client | `axios` |
| Forms | `react-hook-form` + `zod` |
| Styling | `nativewind` v4 + `tailwindcss` v3 |
| Bottom sheets | `@gorhom/bottom-sheet` |
| Drag to reorder | `react-native-draggable-flatlist` |
| Calendar | `react-native-calendars` |
| Image picker | `expo-image-picker` |
| Push notifications | `expo-notifications` |
| Haptics | `expo-haptics` |
| Icons | `lucide-react-native` |
| Date utils | `date-fns` |
| Charts (budget) | `victory-native` [V2] |

### API (`apps/api`)

| Purpose | Package |
|---|---|
| Framework | `@nestjs/core`, `@nestjs/common` |
| Auth | `@clerk/backend` |
| Webhook verification | `svix` |
| ORM | `prisma`, `@prisma/client`, `@prisma/adapter-pg` |
| Validation | `class-validator`, `class-transformer`, `zod` |
| File upload | `multer` |
| Cloudinary | `cloudinary` |
| AI | `@anthropic-ai/sdk` |
| Config | `@nestjs/config` |
| Scheduling (reminders) | `@nestjs/schedule` [V2] |

---

## Environment Variables

### `apps/api/.env`

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/wanderly
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SECRET=whsec_...
ANTHROPIC_API_KEY=sk-ant-...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
PORT=3001
```

### `apps/mobile/.env.local`

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
EXPO_PUBLIC_API_URL=http://localhost:3001
```

> Android emulator: `http://10.0.2.2:3001`. Physical device: your LAN IP.

---

## What Changed from v1 (travelscheduleapp)

| v1 | v2 | Reason |
|---|---|---|
| Firebase Auth + Admin SDK | Clerk | Simpler, built-in OAuth/Apple, webhook-driven sync |
| Guest read-only view | Removed | Adds complexity, hurts retention |
| Email invites | Removed | Join-by-code + deep link is sufficient |
| Separate `Budget` model | Single `budget` field on `Trip` | Actuals-only tracking at MVP |
| `ExpenseType` (PLANNED/ACTUAL) | Removed from MVP | V2 budget forecasting feature |
| 5 trip statuses | 3 (Planning/Completed/Cancelled) | Simpler state machine, no ambiguous "Finalized" |
| Admin + Member roles | Owner + Member | Admin tier adds schema complexity without solving real user problems |
| `/api/v1/gateway` proxy | Removed | Security theater |
| `x-admin-password` header | Clerk org roles | Proper auth |
| Firebase `/api/sync` | Clerk `user.created` webhook | No sync needed |
| `MemberTask` model | Not carried over | Out of scope |

---

## MVP Build Order

1. Prisma schema + migrations
2. NestJS skeleton — PrismaService, ClerkGuard, health check
3. Clerk webhook handler (user.created / user.deleted)
4. Users module
5. Groups + Members module
6. Trips module (solo + group, RSVP)
7. Activities module (incl. reorder endpoint)
8. Expenses + Splits + PaymentLogs module (incl. balance/settle-up endpoint)
9. Notifications module
10. Upload module (Cloudinary)
11. AI module — itinerary generation + budget estimation
12. Expo — Auth flow (sign in, sign up, 1-step onboarding)
13. Expo — Bottom tabs shell + home screen (solo trips + groups)
14. Expo — Group screens (create, join, members, RSVP)
15. Expo — Trip + Activity screens (calendar, list, drag reorder)
16. Expo — Expense screens (add, split, QR, confirm, balance summary)
17. Expo — AI Plan screen (itinerary generation + budget estimate)
18. Expo — Push notifications
19. Admin endpoints

---

*Spec v3.0 — May 2026*
