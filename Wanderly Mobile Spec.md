# Wanderly Mobile — Full Product Spec & Architecture
> **Stack**: Expo React Native · NestJS · Clerk · Prisma · PostgreSQL · Claude API
> **Last updated**: May 2026

---

## Part 1 — Feature Specifications

### Feature Tiers

| Tier | Meaning |
|---|---|
| 🟢 MVP | Must ship at launch |
| 🟡 V2 | Ship within first few months |
| 🔵 V3 | Future / nice to have |

---

### 1. Auth & Onboarding

| Feature | Tier | Notes |
|---|---|---|
| Sign up / Sign in (email + password) | 🟢 | Clerk |
| Google OAuth | 🟢 | Clerk |
| Apple Sign In | 🟢 | Required for iOS App Store |
| Onboarding flow (name, photo, travel style) | 🟢 | 3-step after first login |
| Push notification opt-in prompt | 🟢 | During onboarding |
| Biometric unlock (Face ID / Touch ID) | 🟡 | expo-local-authentication |

---

### 2. Groups

| Feature | Tier | Notes |
|---|---|---|
| Create group (name, emoji, color) | 🟢 | |
| Unique 6-char join code | 🟢 | |
| Join group via code | 🟢 | |
| Join group via deep link | 🟡 | `wanderly://join/ABC123` |
| Member roles (Owner, Admin, Member) | 🟢 | |
| Invite via email | 🟢 | Clerk sends email |
| Remove member (owner/admin) | 🟢 | |
| Leave group | 🟢 | |
| Delete group (owner only) | 🟢 | |
| Edit group details | 🟢 | |
| Guest read-only view via code | 🟢 | No login required |
| Group chat (per-group message thread) | 🟡 | Reduces WhatsApp dependency |
| Real-time member presence (who's online) | 🟡 | Socket.IO, Google Docs-style avatars |
| Open/public groups (discovery) | 🔵 | Others can request to join |

---

### 3. Trips

| Feature | Tier | Notes |
|---|---|---|
| Create trip (name, dates, location, status) | 🟢 | |
| Trip statuses: Planning, Finalized, Ongoing, Completed, Cancelled | 🟢 | |
| Multiple trips per group | 🟢 | |
| Edit / delete trip | 🟢 | |
| Solo trip mode (no group required) | 🟡 | Plan first, invite later |
| Trip templates (save & clone) | 🟡 | Reusable trip structures |
| Export schedule as ICS | 🟢 | For Google/Apple Calendar |
| Export schedule as image (PNG) | 🟢 | Shareable to stories/chat |
| Pre-departure checklist ("What did we forget?" AI scan) | 🟡 | AI-powered gap detection |
| Post-trip recap (AI-generated summary) | 🟡 | Narrative + stats |
| Trip wishlist / bucket list (no dates yet) | 🔵 | |

---

### 4. Activities (Itinerary)

| Feature | Tier | Notes |
|---|---|---|
| Add activity (title, date, time range, notes, location) | 🟢 | |
| Transportation details (mode, pickup/dropoff, time) | 🟢 | |
| Mark activity as done | 🟢 | |
| Edit / delete activity | 🟢 | |
| Calendar view | 🟢 | |
| List / schedule view | 🟢 | |
| Reorder activities via drag | 🟡 | react-native-draggable-flatlist |
| Group voting on proposed activities | 🟡 | 👍/👎 per member |
| Attach photo to activity | 🟡 | Cloudinary upload |
| AI itinerary generation | 🟢 | See AI section |
| Nearby suggestions while on trip | 🔵 | Location-aware |

---

### 5. Expenses & Budget

| Feature | Tier | Notes |
|---|---|---|
| Add expense (amount, description, category, date) | 🟢 | |
| Expense categories (accommodation, food, transport, activities, other) | 🟢 | |
| Split evenly among selected members | 🟢 | |
| Split by custom amounts | 🟡 | |
| Split by percentage | 🟡 | |
| Payment methods (Cash, Bank Transfer, Maya, GCash) | 🟢 | PH-focused |
| QR code upload for payment | 🟢 | Cloudinary |
| Mark payment as received | 🟢 | |
| Payment confirmation flow (submit → confirm/reject) | 🟢 | |
| Payment history log | 🟢 | |
| Settle up / debt simplification | 🟡 | A→B→C becomes A→C |
| Planned budget (PLANNED expense type) | 🟢 | Replaces separate Budget model |
| Budget vs actual tracking per category | 🟡 | |
| Budget alerts (push when 80% spent) | 🟡 | |
| Multi-currency support | 🟡 | Live FX rates |
| AI expense categorization | 🟡 | Type description, AI fills category |
| Receipt scanning (photo → parsed expense) | 🟡 | Vision LLM |
| Per-trip expense summary / breakdown chart | 🟢 | |

---

### 6. AI Features

| Feature | Tier | Model | Notes |
|---|---|---|---|
| Itinerary generation | 🟢 | Claude Sonnet | Prompt → structured Activity records inserted to DB |
| Budget estimation | 🟢 | Claude Sonnet | Destination + duration + style → cost breakdown by category |
| Pre-departure gap check | 🟡 | Claude Sonnet | Scans itinerary, flags missing transfers, accommodation gaps |
| Expense auto-categorization | 🟡 | Claude Sonnet | Text input → category enum |
| Receipt scanning | 🟡 | GPT-4o Vision | Image → amount, merchant, date, category |
| Post-trip recap generation | 🟡 | Claude Sonnet | Completed trip data → narrative summary |
| Destination recommendations | 🔵 | Claude Sonnet | Based on past trips + travel style + budget |

**How AI itinerary works end-to-end:**
1. User fills: destination, dates, group size, budget, interests (food / nature / culture / nightlife / adventure)
2. NestJS `/ai/itinerary` calls Claude Sonnet with a structured system prompt
3. Claude returns a JSON array of activities with day, time, title, location, notes, estimated cost, category
4. Backend validates with Zod, bulk-inserts as `Activity` + `Expense (PLANNED)` records
5. Group sees a fully-populated itinerary they can edit, reorder, vote on

---

### 7. Notifications

| Feature | Tier | Notes |
|---|---|---|
| In-app notification center | 🟢 | |
| Push notifications (Expo) | 🟢 | |
| New expense added | 🟢 | |
| Payment request received | 🟢 | |
| Payment confirmed / rejected | 🟢 | |
| New member joined group | 🟢 | |
| Trip status changed | 🟢 | |
| Activity updated | 🟡 | |
| Budget alert (80% spent) | 🟡 | |
| Pre-trip reminder (3 days before) | 🟡 | |

---

### 8. Profile & Settings

| Feature | Tier | Notes |
|---|---|---|
| Edit profile (name, photo, bio) | 🟢 | |
| Travel style selector | 🟢 | Budget / Mid-range / Luxury |
| Travel interests (multi-select) | 🟢 | Used by AI recommendations |
| Past trips summary | 🟢 | Read-only |
| Change password | 🟢 | Clerk |
| Delete account | 🟢 | Clerk + DB cascade |
| Dark mode | 🟡 | |
| Language / locale | 🔵 | |
| Connected payment methods | 🔵 | |

---

### 9. Discovery (V3)

| Feature | Tier | Notes |
|---|---|---|
| Public Wanderspots (crowdsourced POIs) | 🔵 | Rate + photo a place you visited |
| Destination inspiration feed | 🔵 | Based on travel style + past trips |
| Wishlist matching (find others going to same place) | 🔵 | |

---

## Part 2 — Updated Architecture

### Monorepo Structure

```
wanderly/
├── apps/
│   ├── mobile/          # Expo React Native (Expo Router v3)
│   └── api/             # NestJS backend
├── packages/
│   ├── types/           # Shared TypeScript types & Zod schemas (DTOs)
│   └── utils/           # Shared helpers (currency, dates, itinerary parsing)
├── package.json         # pnpm workspace root
├── pnpm-workspace.yaml
└── turbo.json           # Turborepo pipeline
```

---

### Backend — NestJS (`apps/api`)

#### Module Structure

```
apps/api/src/
├── main.ts
├── app.module.ts
├── auth/
│   ├── clerk.guard.ts           # Verifies Clerk JWT (stateless JWKS)
│   ├── clerk.decorator.ts       # @CurrentUser() param decorator
│   ├── optional-auth.guard.ts   # For guest endpoints
│   └── clerk-webhook.controller.ts  # user.created / user.deleted
├── users/
├── groups/
├── trips/
├── activities/
├── expenses/
├── notifications/
├── upload/                      # Cloudinary
├── ai/
│   ├── ai.module.ts
│   ├── ai.service.ts            # Anthropic SDK wrapper
│   ├── ai.controller.ts
│   └── prompts/
│       ├── itinerary.prompt.ts
│       ├── budget-estimate.prompt.ts
│       ├── expense-parse.prompt.ts
│       ├── gap-check.prompt.ts
│       └── recap.prompt.ts
├── events/
│   └── events.gateway.ts        # Socket.IO WebSocket gateway
├── admin/
└── prisma/
    └── prisma.service.ts
```

#### Auth Flow

```
Mobile (Expo)
  → Clerk signs user in → short-lived JWT stored in SecureStore
  → Every API request: Authorization: Bearer <clerk_jwt>

NestJS ClerkGuard
  → Verifies JWT via Clerk JWKS (stateless, no DB hit)
  → Extracts clerkId from token sub claim
  → Attaches { clerkId, email } to request

Clerk Webhook (user.created)
  → POST /webhooks/clerk
  → Verified via svix signature
  → Creates User row in Postgres
  → No /sync endpoint needed
```

#### ClerkGuard Implementation

```typescript
// auth/clerk.guard.ts
import { verifyToken } from '@clerk/clerk-sdk-node';

@Injectable()
export class ClerkGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedException();
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    req.user = { clerkId: payload.sub };
    return true;
  }
}

// Usage in any controller
@Get('me')
@UseGuards(ClerkGuard)
getProfile(@CurrentUser() user: { clerkId: string }) {
  return this.usersService.findByClerkId(user.clerkId);
}
```

#### WebSocket Gateway

```typescript
// events/events.gateway.ts
@WebSocketGateway({ namespace: '/events', cors: true })
export class EventsGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('join:group')
  handleJoinGroup(client: Socket, groupId: string) {
    client.join(`group:${groupId}`);
  }

  // Called from any service after a mutation
  emitToGroup(groupId: string, event: string, payload: unknown) {
    this.server.to(`group:${groupId}`).emit(event, payload);
  }
}

// In expenses.service.ts after creating an expense:
this.eventsGateway.emitToGroup(trip.groupId, 'expense:created', expense);
```

#### AI Service

```typescript
// ai/ai.service.ts
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class AiService {
  private client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  async generateItinerary(params: ItineraryParams): Promise<Activity[]> {
    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: ITINERARY_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildItineraryPrompt(params) }],
    });

    const raw = response.content[0].type === 'text' ? response.content[0].text : '';
    const parsed = ItineraryResponseSchema.parse(JSON.parse(raw)); // Zod validation
    return parsed.activities;
  }

  async estimateBudget(params: BudgetParams): Promise<BudgetEstimate> { ... }
  async parseExpense(description: string): Promise<ParsedExpense> { ... }
  async checkItineraryGaps(activities: Activity[]): Promise<GapCheckResult> { ... }
  async generateRecap(trip: TripWithAll): Promise<string> { ... }
}
```

#### Itinerary Prompt Pattern

```typescript
// ai/prompts/itinerary.prompt.ts
export const ITINERARY_SYSTEM_PROMPT = `
You are a travel planning assistant. When given trip parameters, return ONLY
a valid JSON object with no markdown, no explanation, no preamble.

Schema:
{
  "activities": [
    {
      "day": 1,
      "title": "string",
      "date": "YYYY-MM-DD",
      "startTime": "HH:MM",
      "endTime": "HH:MM",
      "location": "string",
      "notes": "string",
      "category": "ACCOMMODATION|FOOD|TRANSPORTATION|ACTIVITIES|OTHER",
      "estimatedCostPerPerson": number,
      "transportationMode": "string|null"
    }
  ]
}
`;

export function buildItineraryPrompt(p: ItineraryParams): string {
  return `
    Destination: ${p.destination}
    Start date: ${p.startDate}
    End date: ${p.endDate}
    Group size: ${p.groupSize} people
    Total budget: ${p.currency} ${p.totalBudget}
    Interests: ${p.interests.join(', ')}
    Travel style: ${p.travelStyle}
    Additional notes: ${p.notes ?? 'none'}

    Generate a detailed day-by-day itinerary.
  `;
}
```

#### Full API Routes

```
# No guard
POST  /webhooks/clerk                    Clerk user.created / user.deleted
GET   /groups/guest/:code                Guest read-only view

# ClerkGuard on all below
GET   /users/me
PATCH /users/me
DELETE /users/me                         Triggers Clerk + DB deletion

GET   /groups
POST  /groups
GET   /groups/:id
PATCH /groups/:id
DELETE /groups/:id
POST  /groups/join                       { code }
POST  /groups/:id/leave
GET   /groups/:id/members
DELETE /groups/:id/members/:userId       Kick member

GET   /groups/:groupId/trips
POST  /groups/:groupId/trips
GET   /trips/:id
PATCH /trips/:id
DELETE /trips/:id
GET   /trips/:id/export/ics

GET   /trips/:tripId/activities
POST  /trips/:tripId/activities
PATCH /trips/:tripId/activities/:id
DELETE /trips/:tripId/activities/:id
PATCH /trips/:tripId/activities/:id/vote  { vote: 'up'|'down' }   [V2]

GET   /trips/:tripId/expenses
POST  /trips/:tripId/expenses
GET   /expenses/:id
PATCH /expenses/:id
DELETE /expenses/:id
POST  /expenses/:id/splits/:userId/submit   Submit payment proof
POST  /expenses/:id/splits/:userId/confirm  Confirm or reject

GET   /trips/:tripId/payment-logs

GET   /notifications
GET   /notifications/unread-count
POST  /notifications/:id/read
POST  /notifications/read-all

POST  /upload/image

# AI endpoints
POST  /ai/itinerary          { destination, dates, groupSize, budget, interests, travelStyle }
POST  /ai/budget-estimate    { destination, startDate, endDate, groupSize, travelStyle }
POST  /ai/gap-check          { tripId }   — scans existing itinerary
POST  /ai/parse-expense      { description }   — text → category + amount
POST  /ai/recap              { tripId }   — generates post-trip summary   [V2]

# Admin (Clerk org role: admin)
GET   /admin/users
DELETE /admin/users/:id
GET   /admin/stats
GET   /admin/config
POST  /admin/config
```

---

### Database Schema (Full Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Users ───────────────────────────────────────────────────────────────────

model User {
  id              String         @id @default(cuid())
  clerkId         String         @unique
  email           String         @unique
  name            String?
  photoUrl        String?
  bio             String?
  travelStyle     TravelStyle    @default(BUDGET)
  interests       String[]       // ["food", "hiking", "culture", ...]
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  groups          GroupMember[]
  paidExpenses    Expense[]      @relation("PaidBy")
  splits          ExpenseSplit[]
  notifications   Notification[]
  activityVotes   ActivityVote[]
}

enum TravelStyle {
  BUDGET
  MID_RANGE
  LUXURY
}

// ─── Groups ──────────────────────────────────────────────────────────────────

model Group {
  id          String        @id @default(cuid())
  name        String
  code        String        @unique
  colorScheme String        @default("orange")
  emoji       String?
  isPublic    Boolean       @default(false)  // V3: discovery
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  members     GroupMember[]
  trips       Trip[]
  messages    Message[]     // V2: group chat
}

model GroupMember {
  id        String     @id @default(cuid())
  groupId   String
  userId    String
  role      MemberRole @default(MEMBER)
  joinedAt  DateTime   @default(now())

  group     Group      @relation(fields: [groupId], references: [id], onDelete: Cascade)
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([groupId, userId])
}

enum MemberRole {
  OWNER
  ADMIN
  MEMBER
}

// ─── Trips ───────────────────────────────────────────────────────────────────

model Trip {
  id          String      @id @default(cuid())
  groupId     String
  name        String
  destination String?
  location    String?
  startDate   DateTime?
  endDate     DateTime?
  status      TripStatus  @default(PLANNING)
  currency    String      @default("PHP")    // ISO 4217
  totalBudget Decimal?    @db.Decimal(12, 2)
  isTemplate  Boolean     @default(false)    // V2: saveable templates
  aiGenerated Boolean     @default(false)    // was itinerary AI-created?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  group       Group       @relation(fields: [groupId], references: [id], onDelete: Cascade)
  activities  Activity[]
  expenses    Expense[]
}

enum TripStatus {
  PLANNING
  FINALIZED
  ONGOING
  COMPLETED
  CANCELLED
}

// ─── Activities ──────────────────────────────────────────────────────────────

model Activity {
  id                 String         @id @default(cuid())
  tripId             String
  title              String
  date               DateTime
  startTime          String?
  endTime            String?
  location           String?
  notes              String?
  done               Boolean        @default(false)
  transportationMode String?
  pickupTime         String?
  pickupLocation     String?
  dropoffLocation    String?
  photoUrl           String?        // V2: activity photo
  aiSuggested        Boolean        @default(false)
  sortOrder          Int            @default(0)
  createdAt          DateTime       @default(now())
  updatedAt          DateTime       @updatedAt

  trip               Trip           @relation(fields: [tripId], references: [id], onDelete: Cascade)
  votes              ActivityVote[] // V2: group voting
}

// V2: voting on proposed activities
model ActivityVote {
  id         String   @id @default(cuid())
  activityId String
  userId     String
  vote       VoteType
  createdAt  DateTime @default(now())

  activity   Activity @relation(fields: [activityId], references: [id], onDelete: Cascade)
  user       User     @relation(fields: [userId], references: [id])

  @@unique([activityId, userId])
}

enum VoteType {
  UP
  DOWN
}

// ─── Expenses & Budget ───────────────────────────────────────────────────────

model Expense {
  id            String          @id @default(cuid())
  tripId        String
  paidByUserId  String
  amount        Decimal         @db.Decimal(12, 2)
  currency      String          @default("PHP")
  description   String
  category      ExpenseCategory
  type          ExpenseType     @default(ACTUAL)  // PLANNED = budget, ACTUAL = real
  date          DateTime
  paymentMethod PaymentMethod   @default(CASH)
  accountNumber String?
  bankName      String?
  qrImageUrl    String?
  receiptUrl    String?         // V2: scanned receipt photo
  aiParsed      Boolean         @default(false)
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  trip          Trip            @relation(fields: [tripId], references: [id], onDelete: Cascade)
  paidBy        User            @relation("PaidBy", fields: [paidByUserId], references: [id])
  splits        ExpenseSplit[]
  paymentLogs   PaymentLog[]
}

enum ExpenseType {
  PLANNED   // Budget / pre-trip estimate
  ACTUAL    // Real expense
}

enum ExpenseCategory {
  ACCOMMODATION
  FOOD
  TRANSPORTATION
  ACTIVITIES
  OTHER
}

enum PaymentMethod {
  CASH
  BANK_TRANSFER
  MAYA
  GCASH
}

model ExpenseSplit {
  id        String        @id @default(cuid())
  expenseId String
  userId    String
  amount    Decimal       @db.Decimal(12, 2)
  isPaid    Boolean       @default(false)
  status    PaymentStatus @default(PENDING)
  proofUrl  String?       // screenshot of payment

  expense   Expense       @relation(fields: [expenseId], references: [id], onDelete: Cascade)
  user      User          @relation(fields: [userId], references: [id])

  @@unique([expenseId, userId])
}

enum PaymentStatus {
  PENDING
  SUBMITTED    // user said they paid, awaiting confirmation
  CONFIRMED
  REJECTED
}

model PaymentLog {
  id            String        @id @default(cuid())
  expenseId     String
  payerUserId   String
  payeeUserId   String
  amount        Decimal       @db.Decimal(12, 2)
  paymentMethod PaymentMethod
  note          String?
  createdAt     DateTime      @default(now())

  expense       Expense       @relation(fields: [expenseId], references: [id], onDelete: Cascade)
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

  user      User             @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum NotificationType {
  GROUP_INVITE
  MEMBER_JOINED
  EXPENSE_ADDED
  PAYMENT_REQUEST
  PAYMENT_CONFIRMED
  PAYMENT_REJECTED
  TRIP_UPDATED
  ACTIVITY_UPDATED
  BUDGET_ALERT
  TRIP_REMINDER
  AI_ITINERARY_READY
}

// ─── V2: Group Chat ──────────────────────────────────────────────────────────

model Message {
  id        String   @id @default(cuid())
  groupId   String
  userId    String
  content   String
  createdAt DateTime @default(now())

  group     Group    @relation(fields: [groupId], references: [id], onDelete: Cascade)
}

// ─── Admin / Config ──────────────────────────────────────────────────────────

model AppConfig {
  key       String   @id
  value     Json
  updatedAt DateTime @updatedAt
}
```

---

### Frontend — Expo React Native (`apps/mobile`)

#### Project Structure

```
apps/mobile/
├── app/                          # Expo Router v3 (file-based)
│   ├── _layout.tsx               # ClerkProvider + QueryClient root
│   ├── index.tsx                 # Redirect → (auth) or (tabs)
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Bottom tab navigator
│   │   ├── index.tsx             # Home — groups list
│   │   ├── trips.tsx             # My active trips (cross-group)
│   │   └── profile.tsx
│   ├── group/
│   │   └── [groupId]/
│   │       ├── index.tsx         # Group detail + trips list
│   │       ├── members.tsx
│   │       ├── chat.tsx          # V2
│   │       └── trips/
│   │           └── [tripId]/
│   │               ├── index.tsx       # Trip detail — activities
│   │               ├── expenses.tsx
│   │               ├── budget.tsx
│   │               └── ai-plan.tsx     # AI itinerary generator
│   └── guest/
│       └── [code].tsx            # Guest read-only (no auth)
├── components/
│   ├── ui/                       # Button, Input, Card, Badge, Sheet, Avatar
│   ├── groups/                   # GroupCard, JoinCodeModal, MemberRow
│   ├── trips/                    # TripCard, StatusBadge, ActivityItem
│   ├── expenses/                 # ExpenseCard, SplitRow, PaymentPicker
│   ├── ai/                       # AiPlanForm, ItineraryPreview, BudgetEstimate
│   └── shared/                   # EmptyState, LoadingSpinner, ErrorBoundary
├── hooks/
│   ├── useCurrentUser.ts         # Wraps Clerk useUser
│   ├── useGroups.ts
│   ├── useTrip.ts
│   ├── useActivities.ts
│   ├── useExpenses.ts
│   ├── useNotifications.ts
│   ├── useSocket.ts              # Socket.IO group room hook
│   └── useAi.ts                  # AI mutation hooks
├── lib/
│   ├── api.ts                    # Axios + Clerk token interceptor
│   ├── socket.ts                 # Socket.IO client singleton
│   └── queryClient.ts
└── constants/
    └── theme.ts                  # Colors, typography, spacing
```

#### Screen Flow

```
Launch
  ↓
Clerk session?
  No  → Sign In / Sign Up → Onboarding (name, photo, travel style, interests)
  Yes → (tabs)/Home

Home
  → [Group Card] → Group Detail
      → [Trip Card] → Trip Detail (Activities tab | Expenses tab | Budget tab)
          → AI Plan screen → fills activities + planned expenses
      → Members screen
      → Group Chat (V2)
  → Join group (enter code)
  → Create group

Profile
  → Edit profile, travel style, interests
  → Past trips
  → Notification settings
```

#### Axios + Clerk Token

```typescript
// lib/api.ts
import axios from 'axios';
import { useAuth } from '@clerk/clerk-expo';

export function useApiClient() {
  const { getToken } = useAuth();
  const client = axios.create({ baseURL: process.env.EXPO_PUBLIC_API_URL });
  client.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  return client;
}
```

#### Socket.IO Hook

```typescript
// hooks/useSocket.ts
export function useGroupSocket(groupId: string) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    let socket: ReturnType<typeof io>;
    (async () => {
      const token = await getToken();
      socket = io(`${process.env.EXPO_PUBLIC_SOCKET_URL}/events`, {
        auth: { token },
      });
      socket.emit('join:group', groupId);

      // Invalidate TanStack Query cache on any server event
      socket.on('expense:created',    () => queryClient.invalidateQueries({ queryKey: ['expenses', groupId] }));
      socket.on('expense:updated',    () => queryClient.invalidateQueries({ queryKey: ['expenses', groupId] }));
      socket.on('activity:created',   () => queryClient.invalidateQueries({ queryKey: ['activities', groupId] }));
      socket.on('activity:updated',   () => queryClient.invalidateQueries({ queryKey: ['activities', groupId] }));
      socket.on('member:joined',      () => queryClient.invalidateQueries({ queryKey: ['group', groupId] }));
      socket.on('payment:confirmed',  () => queryClient.invalidateQueries({ queryKey: ['expenses', groupId] }));
    })();
    return () => socket?.disconnect();
  }, [groupId]);
}
```

#### Root Layout (Clerk + Query setup)

```typescript
// app/_layout.tsx
import { ClerkProvider } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

const tokenCache = {
  getToken: (key: string) => SecureStore.getItemAsync(key),
  saveToken: (key: string, v: string) => SecureStore.setItemAsync(key, v),
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

---

### Key Package Choices

#### Mobile (`apps/mobile`)

| Purpose | Package |
|---|---|
| Framework | `expo` ~52, `expo-router` v3 |
| Auth | `@clerk/clerk-expo` |
| Secure token storage | `expo-secure-store` |
| Data fetching | `@tanstack/react-query` v5 |
| HTTP client | `axios` |
| Real-time | `socket.io-client` |
| Forms | `react-hook-form` + `zod` |
| UI primitives | `react-native-reusables` |
| Bottom sheets | `@gorhom/bottom-sheet` |
| Drag to reorder | `react-native-draggable-flatlist` |
| Calendar | `react-native-calendars` |
| Image picker | `expo-image-picker` |
| Push notifications | `expo-notifications` |
| Haptics | `expo-haptics` |
| Icons | `lucide-react-native` |
| Date utils | `date-fns` |
| Charts (budget) | `victory-native` |
| Biometrics | `expo-local-authentication` |

#### API (`apps/api`)

| Purpose | Package |
|---|---|
| Framework | `@nestjs/core`, `@nestjs/common` |
| Auth | `@clerk/clerk-sdk-node` |
| Webhook verification | `svix` |
| ORM | `prisma`, `@prisma/client` |
| Validation | `class-validator`, `class-transformer`, `zod` |
| WebSockets | `@nestjs/websockets`, `socket.io` |
| File upload | `multer` |
| Cloudinary | `cloudinary` |
| AI | `@anthropic-ai/sdk` |
| Config | `@nestjs/config` |
| Scheduling (reminders) | `@nestjs/schedule` |

---

### Environment Variables

#### `apps/api/.env`

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/wanderly
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SECRET=whsec_...
ANTHROPIC_API_KEY=sk-ant-...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
PORT=3001
```

#### `apps/mobile/.env`

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
EXPO_PUBLIC_API_URL=http://localhost:3001/api/v1
EXPO_PUBLIC_SOCKET_URL=http://localhost:3001
```

---

### What Was Dropped from the Original

| Original | Reason |
|---|---|
| Firebase Auth + Admin SDK | Replaced entirely by Clerk |
| `/api/v1/gateway` proxy | Security theater — NestJS guards handle this properly |
| `x-admin-password` header | Replaced by Clerk organization roles |
| 30-second guest polling | Replaced by Socket.IO rooms |
| Separate `Budget` model | Merged into `Expense` with `type: PLANNED\|ACTUAL` |
| `/api/sync` endpoint | Replaced by Clerk `user.created` webhook |
| `repro_delete.ts` in root | Deleted |

---

### MVP Build Order

1. Monorepo setup (Turborepo, pnpm, shared `packages/types`)
2. NestJS skeleton — PrismaService, ClerkGuard, health check
3. Clerk webhook handler — User creation/deletion
4. Groups + Members module
5. Trips module
6. Activities module
7. Expenses + Splits + PaymentLogs module
8. Notifications module
9. Upload module (Cloudinary)
10. AI module — itinerary generation first, then budget estimate
11. WebSocket gateway
12. Expo app — Auth flow (Clerk)
13. Expo app — Bottom tabs shell
14. Expo app — Groups screens
15. Expo app — Trip + Activity screens
16. Expo app — Expense screens
17. Expo app — AI Plan screen
18. Expo app — Push notifications
19. Admin endpoints

---

*Spec version 2.0 — Updated May 2026*
