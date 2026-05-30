import { z } from 'zod';
import type { UpdateUserProfileRequest } from '@workspace/shared';

export const updateUserProfileSchema = z
  .object({
    name: z.string().trim().min(1).nullable().optional(),
    photoUrl: z.string().url().nullable().optional(),
    bio: z.string().trim().max(500).nullable().optional(),
    travelStyle: z.enum(['BUDGET', 'MID_RANGE', 'LUXURY']).optional(),
    interests: z.array(z.string().trim().min(1)).optional(),
    hasCompletedOnboarding: z.boolean().optional(),
  })
  .strict() satisfies z.ZodType<UpdateUserProfileRequest>;

export type UpdateUserProfileDto = z.infer<typeof updateUserProfileSchema>;
