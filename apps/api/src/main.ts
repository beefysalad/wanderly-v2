import { existsSync } from 'node:fs';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

type ExpressAppWithTrustProxy = {
  set: (setting: 'trust proxy', value: boolean) => void;
};

function shouldTrustProxy(value: string | undefined): boolean {
  return value === 'true' || value === '1';
}

async function bootstrap() {
  if (existsSync('.env')) {
    process.loadEnvFile('.env');
  }

  const app = await NestFactory.create(AppModule, { rawBody: true });

  if (shouldTrustProxy(process.env.TRUST_PROXY)) {
    const expressApp = app
      .getHttpAdapter()
      .getInstance() as ExpressAppWithTrustProxy;
    expressApp.set('trust proxy', true);
  }

  const corsOrigin = process.env.CORS_ORIGIN;

  if (corsOrigin) {
    app.enableCors({
      origin: corsOrigin.split(',').map((origin) => origin.trim()),
    });
  }

  await app.listen(Number(process.env.PORT ?? 3000));
}
void bootstrap();
