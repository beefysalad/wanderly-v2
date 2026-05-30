import { existsSync } from 'node:fs';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  if (existsSync('.env')) {
    process.loadEnvFile('.env');
  }

  const app = await NestFactory.create(AppModule, { rawBody: true });
  const corsOrigin = process.env.CORS_ORIGIN;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  if (corsOrigin) {
    app.enableCors({
      origin: corsOrigin.split(',').map((origin) => origin.trim()),
    });
  }

  await app.listen(Number(process.env.PORT ?? 3000));
}
void bootstrap();
