import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

type HealthResponseBody = {
  status?: unknown;
  timestamp?: unknown;
};

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  const originalMaxRequests = process.env.API_RATE_LIMIT_MAX_REQUESTS;
  const originalTtlMs = process.env.API_RATE_LIMIT_TTL_MS;

  beforeEach(async () => {
    process.env.API_RATE_LIMIT_MAX_REQUESTS = '1';
    process.env.API_RATE_LIMIT_TTL_MS = '60000';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    process.env.API_RATE_LIMIT_MAX_REQUESTS = originalMaxRequests;
    process.env.API_RATE_LIMIT_TTL_MS = originalTtlMs;
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(({ body }: { body: HealthResponseBody }) => {
        if (typeof body.timestamp !== 'string') {
          throw new Error('Expected health timestamp to be a string');
        }

        expect(body.status).toBe('ok');
        expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
      });
  });

  it('/ (GET) returns 429 after the global request limit is exceeded', async () => {
    await request(app.getHttpServer()).get('/').expect(200);

    await request(app.getHttpServer()).get('/').expect(429);
  });

  it('/webhooks/clerk (POST) uses a looser endpoint limit for webhook retries', async () => {
    await request(app.getHttpServer())
      .post('/webhooks/clerk')
      .send({})
      .expect(400);

    await request(app.getHttpServer())
      .post('/webhooks/clerk')
      .send({})
      .expect(400);
  });
});
