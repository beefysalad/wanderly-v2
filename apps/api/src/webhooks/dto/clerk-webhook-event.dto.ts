import { z } from 'zod';

const clerkEmailAddressSchema = z.object({
  id: z.string(),
  email_address: z.string().email(),
});

const clerkExternalAccountSchema = z.object({
  provider: z.string(),
});

const clerkUserDataSchema = z.object({
  id: z.string(),
  email_addresses: z.array(clerkEmailAddressSchema).optional(),
  external_accounts: z.array(clerkExternalAccountSchema).optional(),
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

export const clerkWebhookEventSchema = z.discriminatedUnion('type', [
  z.object({
    data: clerkUserDataSchema,
    type: z.enum(['user.created', 'user.updated']),
  }),
  z.object({
    data: clerkDeletedUserDataSchema,
    type: z.literal('user.deleted'),
  }),
]);

export type ClerkUserData = z.infer<typeof clerkUserDataSchema>;
export type ClerkWebhookEvent = z.infer<typeof clerkWebhookEventSchema>;
