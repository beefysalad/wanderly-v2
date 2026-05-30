# API Rate Limiting

Tracks the implementation for `WND-14`: backend request throttling for `apps/api`.

## Implementation

The API uses the official Nest package `@nestjs/throttler`, registered globally through `RateLimitModule`.

Files:

- `apps/api/src/common/rate-limit/rate-limit.module.ts`
- `apps/api/src/common/rate-limit/rate-limit.config.ts`
- `apps/api/src/app.module.ts`

The default limiter is IP-based, which is the standard behavior of `@nestjs/throttler` for Express apps.

## Default Policy

Configured from environment variables:

```bash
API_RATE_LIMIT_MAX_REQUESTS=120
API_RATE_LIMIT_TTL_MS=60000
```

This applies globally through `APP_GUARD`.

## Endpoint Overrides

Sensitive or special-case endpoints have explicit `@Throttle` overrides:

- `POST /users/me/sync`: stricter authenticated self-sync fallback limit.
- `POST /webhooks/clerk`: separate webhook limit so legitimate Clerk retries are not blocked by the global default too aggressively.

Configured values:

```bash
API_USER_SYNC_RATE_LIMIT_MAX_REQUESTS=20
API_USER_SYNC_RATE_LIMIT_TTL_MS=60000

API_CLERK_WEBHOOK_RATE_LIMIT_MAX_REQUESTS=60
API_CLERK_WEBHOOK_RATE_LIMIT_TTL_MS=60000
```

Future AI endpoints should add their own explicit `@Throttle` override before launch because they may call paid external LLM APIs.

## Proxy Behavior

Set this only in hosted environments where the API is behind a trusted proxy or load balancer:

```bash
TRUST_PROXY=true
```

When enabled, Express can derive `req.ip` from proxy headers such as `X-Forwarded-For`, which is what `@nestjs/throttler` uses for its default tracker. Do not enable this for untrusted direct internet traffic, because forwarded IP headers can be spoofed when no trusted proxy controls them.

## Current Storage

`@nestjs/throttler` uses in-memory storage by default. That is acceptable for the current single-instance MVP setup. If the API runs multiple instances, move to a shared throttler storage provider such as Redis so limits are enforced consistently across instances.

## Verification

Focused e2e coverage lives in `apps/api/test/app.e2e-spec.ts`:

- A normal allowed request to `GET /`.
- A throttled `GET /` path returning `429`.
- A Clerk webhook retry path that reaches webhook validation twice instead of being blocked by the global limit.

Useful commands:

```bash
npm run test:e2e -w api -- app.e2e-spec.ts
npm run typecheck -w api
npm run test -w api
npm run build -w api
```
