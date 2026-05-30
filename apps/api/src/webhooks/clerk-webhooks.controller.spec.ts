import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { verifyWebhook } from '@clerk/backend/webhooks';
import { ClerkWebhooksController } from './clerk-webhooks.controller';
import type { UsersRepository } from '../users/users.repository';

jest.mock('@clerk/backend/webhooks', () => ({
  verifyWebhook: jest.fn(),
}));

const mockVerifyWebhook = jest.mocked(verifyWebhook);
const webhookSecret = 'whsec_unit_test_secret';

function createWebhookRequest(body: unknown) {
  const payload = JSON.stringify(body);
  const msgId = 'msg_unit_test';

  return {
    request: {
      rawBody: Buffer.from(payload),
    },
    body,
    headers: {
      'webhook-id': msgId,
      'webhook-signature': 'sig_unit_test',
      'webhook-timestamp': '1700000000',
    },
  };
}

describe('ClerkWebhooksController', () => {
  let usersRepository: jest.Mocked<
    Pick<UsersRepository, 'deleteByClerkId' | 'upsertClerkUser'>
  >;
  let controller: ClerkWebhooksController;
  const originalSecret = process.env.CLERK_WEBHOOK_SECRET;
  const originalSigningSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  beforeEach(() => {
    process.env.CLERK_WEBHOOK_SECRET = webhookSecret;
    delete process.env.CLERK_WEBHOOK_SIGNING_SECRET;
    mockVerifyWebhook.mockReset();

    usersRepository = {
      deleteByClerkId: jest.fn().mockResolvedValue(undefined),
      upsertClerkUser: jest.fn().mockResolvedValue({
        id: 'user_db_1',
        clerkId: 'user_123',
        email: 'pat@example.com',
        name: 'Patrick',
        imageUrl: 'https://example.com/avatar.png',
      }),
    };
    controller = new ClerkWebhooksController(
      usersRepository as unknown as UsersRepository,
    );
  });

  afterEach(() => {
    process.env.CLERK_WEBHOOK_SECRET = originalSecret;
    process.env.CLERK_WEBHOOK_SIGNING_SECRET = originalSigningSecret;
  });

  it('upserts a User for a valid user.created event', async () => {
    const event = {
      type: 'user.created',
      data: {
        id: 'user_123',
        email_addresses: [
          {
            id: 'email_1',
            email_address: 'pat@example.com',
          },
        ],
        first_name: 'Patrick',
        image_url: 'https://example.com/avatar.png',
        last_name: null,
        primary_email_address_id: 'email_1',
        username: null,
      },
    };
    mockVerifyWebhook.mockResolvedValueOnce(event as never);

    const { request, body, headers } = createWebhookRequest(event);

    await expect(
      controller.handleClerkWebhook(
        request as never,
        body,
        undefined,
        undefined,
        undefined,
        headers['webhook-id'],
        headers['webhook-timestamp'],
        headers['webhook-signature'],
      ),
    ).resolves.toEqual({ received: true });

    expect(usersRepository.upsertClerkUser).toHaveBeenCalledWith({
      clerkId: 'user_123',
      email: 'pat@example.com',
      imageUrl: 'https://example.com/avatar.png',
      name: 'Patrick',
    });
    expect(mockVerifyWebhook).toHaveBeenCalledWith(expect.anything(), {
      signingSecret: webhookSecret,
    });
    expect(usersRepository.deleteByClerkId).not.toHaveBeenCalled();
  });

  it('upserts a User for a valid user.updated event', async () => {
    const event = {
      type: 'user.updated',
      data: {
        id: 'user_123',
        email_addresses: [
          {
            id: 'email_1',
            email_address: 'updated@example.com',
          },
        ],
        first_name: 'Updated',
        image_url: null,
        last_name: 'User',
        primary_email_address_id: 'email_1',
        username: null,
      },
    };
    mockVerifyWebhook.mockResolvedValueOnce(event as never);

    const { request, body, headers } = createWebhookRequest(event);

    await expect(
      controller.handleClerkWebhook(
        request as never,
        body,
        undefined,
        undefined,
        undefined,
        headers['webhook-id'],
        headers['webhook-timestamp'],
        headers['webhook-signature'],
      ),
    ).resolves.toEqual({ received: true });

    expect(usersRepository.upsertClerkUser).toHaveBeenCalledWith({
      clerkId: 'user_123',
      email: 'updated@example.com',
      imageUrl: null,
      name: 'Updated User',
    });
    expect(usersRepository.deleteByClerkId).not.toHaveBeenCalled();
  });

  it('deletes a User for a valid user.deleted event', async () => {
    const event = {
      type: 'user.deleted',
      data: {
        deleted: true,
        id: 'user_123',
      },
    };
    mockVerifyWebhook.mockResolvedValueOnce(event as never);

    const { request, body, headers } = createWebhookRequest(event);

    await expect(
      controller.handleClerkWebhook(
        request as never,
        body,
        undefined,
        undefined,
        undefined,
        headers['webhook-id'],
        headers['webhook-timestamp'],
        headers['webhook-signature'],
      ),
    ).resolves.toEqual({ received: true });

    expect(usersRepository.deleteByClerkId).toHaveBeenCalledWith('user_123');
    expect(usersRepository.upsertClerkUser).not.toHaveBeenCalled();
  });

  it('returns 400 for an invalid svix signature', async () => {
    const event = {
      type: 'user.deleted',
      data: {
        deleted: true,
        id: 'user_123',
      },
    };
    mockVerifyWebhook.mockRejectedValueOnce(new Error('invalid signature'));

    const { request, body, headers } = createWebhookRequest(event);

    await expect(
      controller.handleClerkWebhook(
        request as never,
        body,
        undefined,
        undefined,
        undefined,
        headers['webhook-id'],
        headers['webhook-timestamp'],
        headers['webhook-signature'],
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('returns 500 when user.created persistence fails', async () => {
    usersRepository.upsertClerkUser.mockRejectedValueOnce(new Error('db down'));

    const event = {
      type: 'user.created',
      data: {
        id: 'user_123',
        email_addresses: [
          {
            id: 'email_1',
            email_address: 'pat@example.com',
          },
        ],
        primary_email_address_id: 'email_1',
      },
    };
    mockVerifyWebhook.mockResolvedValueOnce(event as never);

    const { request, body, headers } = createWebhookRequest(event);

    await expect(
      controller.handleClerkWebhook(
        request as never,
        body,
        undefined,
        undefined,
        undefined,
        headers['webhook-id'],
        headers['webhook-timestamp'],
        headers['webhook-signature'],
      ),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });
});
