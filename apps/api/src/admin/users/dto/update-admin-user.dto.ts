import { z } from 'zod';
import type { UpdateAdminUserRequest } from '@workspace/shared';

export const updateAdminUserSchema = z
  .object({
    hasCompletedOnboarding: z.boolean().optional(),
  })
  .strict()
  .refine((input) => Object.keys(input).length > 0, {
    message: 'At least one admin user field must be provided',
  }) satisfies z.ZodType<UpdateAdminUserRequest>;

export type UpdateAdminUserDto = z.infer<typeof updateAdminUserSchema>;
