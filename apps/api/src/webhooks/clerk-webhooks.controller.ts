import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  InternalServerErrorException,
  Post,
  Req,
} from '@nestjs/common';
import { Webhook } from 'standardwebhooks';
import { z } from 'zod';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { UsersRepository } from '../users/users.repository';

const clerkEmailAddressSchema = z.object({
  id: z.string(),
  email_address: z.string().email(),
});

const clerkUserDataSchema = z.object({
  id: z.string(),
  email_addresses: z.array(clerkEmailAddressSchema).optional(),
  first_name: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  primary_email_address_id: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
});

const clerkDeletedUserDataSchema = z.object({
  id: z.string().optional(),
  deleted: z.boolean().optional(),
});

const clerkWebhookEventSchema = z.discriminatedUnion('type', [
  z.object({
    data: clerkUserDataSchema,
    type: z.enum(['user.created', 'user.updated']),
  }),
  z.object({
    data: clerkDeletedUserDataSchema,
    type: z.literal('user.deleted'),
  }),
]);

type ClerkUserData = z.infer<typeof clerkUserDataSchema>;
type ClerkWebhookEvent = z.infer<typeof clerkWebhookEventSchema>;

@Controller('webhooks/clerk')
export class ClerkWebhooksController {
  constructor(private readonly usersRepository: UsersRepository) {}

  @Post()
  async handleClerkWebhook(
    @Req() request: RawBodyRequest<Request>,
    @Body() body: unknown,
    @Headers('webhook-id') webhookId?: string,
    @Headers('webhook-timestamp') webhookTimestamp?: string,
    @Headers('webhook-signature') webhookSignature?: string,
    @Headers('svix-id') svixId?: string,
    @Headers('svix-timestamp') svixTimestamp?: string,
    @Headers('svix-signature') svixSignature?: string,
  ): Promise<{ received: true }> {
    const event = this.verifyWebhookEvent(request, body, {
      'webhook-id': webhookId ?? svixId,
      'webhook-timestamp': webhookTimestamp ?? svixTimestamp,
      'webhook-signature': webhookSignature ?? svixSignature,
    });

    if (event.type === 'user.deleted') {
      if (event.data.id) {
        await this.persistWebhookChange(() =>
          this.usersRepository.deleteByClerkId(event.data.id!),
        );
      }

      return { received: true };
    }

    if (event.type === 'user.created') {
      await this.persistWebhookChange(() =>
        this.usersRepository.upsertClerkUser(this.toUpsertInput(event.data)),
      );
    }

    return { received: true };
  }

  private verifyWebhookEvent(
    request: RawBodyRequest<Request>,
    body: unknown,
    headers: {
      'webhook-id'?: string;
      'webhook-timestamp'?: string;
      'webhook-signature'?: string;
    },
  ): ClerkWebhookEvent {
    const secret =
      process.env.CLERK_WEBHOOK_SIGNING_SECRET ??
      process.env.CLERK_WEBHOOK_SECRET;

    if (!secret) {
      throw new BadRequestException('Missing CLERK_WEBHOOK_SECRET');
    }

    if (
      !headers['webhook-id'] ||
      !headers['webhook-timestamp'] ||
      !headers['webhook-signature']
    ) {
      throw new BadRequestException('Missing Clerk webhook signature headers');
    }

    const payload = request.rawBody ?? JSON.stringify(body);

    try {
      const verifiedEvent = new Webhook(secret).verify(payload, {
        'webhook-id': headers['webhook-id'],
        'webhook-timestamp': headers['webhook-timestamp'],
        'webhook-signature': headers['webhook-signature'],
      });

      const parsedEvent = clerkWebhookEventSchema.safeParse(verifiedEvent);

      if (!parsedEvent.success) {
        throw new BadRequestException('Invalid Clerk webhook payload');
      }

      return parsedEvent.data;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException('Invalid Clerk webhook signature');
    }
  }

  private toUpsertInput(user: ClerkUserData) {
    const primaryEmail =
      user.email_addresses?.find(
        (email) => email.id === user.primary_email_address_id,
      ) ?? user.email_addresses?.[0];

    if (!primaryEmail) {
      throw new BadRequestException('Clerk user has no email address');
    }

    const name =
      [user.first_name, user.last_name].filter(Boolean).join(' ') ||
      user.username ||
      primaryEmail.email_address;

    return {
      clerkId: user.id,
      email: primaryEmail.email_address,
      name,
      imageUrl: user.image_url ?? null,
    };
  }

  private async persistWebhookChange(
    operation: () => Promise<unknown>,
  ): Promise<void> {
    try {
      await operation();
    } catch {
      throw new InternalServerErrorException('Failed to persist Clerk webhook');
    }
  }
}
