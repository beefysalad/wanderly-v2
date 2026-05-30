import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  InternalServerErrorException,
  Post,
  Req,
} from '@nestjs/common';
import { verifyWebhook } from '@clerk/backend/webhooks';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { UsersRepository } from '../users/users.repository';
import {
  clerkWebhookEventSchema,
  type ClerkUserData,
  type ClerkWebhookEvent,
} from './dto/clerk-webhook-event.dto';

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
    const event = await this.verifyWebhookEvent(request, body, {
      'webhook-id': webhookId ?? svixId,
      'webhook-timestamp': webhookTimestamp ?? svixTimestamp,
      'webhook-signature': webhookSignature ?? svixSignature,
    });

    if (event.type === 'user.deleted') {
      const deletedClerkId = event.data.id;

      if (deletedClerkId) {
        await this.persistWebhookChange(() =>
          this.usersRepository.deleteByClerkId(deletedClerkId),
        );
      }

      return { received: true };
    }

    if (event.type === 'user.created' || event.type === 'user.updated') {
      await this.persistWebhookChange(() =>
        this.usersRepository.upsertClerkUser(this.toUpsertInput(event.data)),
      );
    }

    return { received: true };
  }

  private async verifyWebhookEvent(
    request: RawBodyRequest<Request>,
    body: unknown,
    headers: {
      'webhook-id'?: string;
      'webhook-timestamp'?: string;
      'webhook-signature'?: string;
    },
  ): Promise<ClerkWebhookEvent> {
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

    const payload = request.rawBody
      ? new Uint8Array(request.rawBody)
      : JSON.stringify(body);

    try {
      const verifiedEvent = await verifyWebhook(
        new Request('https://wanderly.local/webhooks/clerk', {
          method: 'POST',
          headers: {
            'webhook-id': headers['webhook-id'],
            'webhook-timestamp': headers['webhook-timestamp'],
            'webhook-signature': headers['webhook-signature'],
          },
          body: payload,
        }),
        { signingSecret: secret },
      );

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
