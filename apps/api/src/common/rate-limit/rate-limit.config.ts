import type { ThrottlerModuleOptions } from '@nestjs/throttler';

type ThrottleOverride = {
  default: {
    limit: number;
    ttl: number;
  };
};

function getPositiveInteger(
  env: NodeJS.ProcessEnv,
  key: string,
  fallback: number,
): number {
  const value = env[key];

  if (!value) {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

export function createThrottlerOptions(
  env: NodeJS.ProcessEnv = process.env,
): ThrottlerModuleOptions {
  return {
    errorMessage: 'Too many requests. Please try again later.',
    throttlers: [
      {
        name: 'default',
        limit: getPositiveInteger(env, 'API_RATE_LIMIT_MAX_REQUESTS', 120),
        ttl: getPositiveInteger(env, 'API_RATE_LIMIT_TTL_MS', 60000),
      },
    ],
  };
}

export function createThrottleOverride(
  limitKey: string,
  ttlKey: string,
  fallbackLimit: number,
  fallbackTtlMs: number,
): ThrottleOverride {
  return {
    default: {
      limit: getPositiveInteger(process.env, limitKey, fallbackLimit),
      ttl: getPositiveInteger(process.env, ttlKey, fallbackTtlMs),
    },
  };
}
