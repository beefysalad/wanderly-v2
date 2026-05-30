import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { createThrottlerOptions } from './rate-limit.config';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: createThrottlerOptions,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class RateLimitModule {}
