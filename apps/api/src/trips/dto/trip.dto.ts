import { z } from 'zod';
import type {
  AttachTripToGroupRequest,
  CreateTripRequest,
  UpdateTripRequest,
  UpdateTripRsvpRequest,
} from '@workspace/shared';

const decimalStringSchema = z
  .string()
  .trim()
  .regex(/^\d+(\.\d{1,2})?$/, 'Expected a non-negative decimal amount');

const budgetSchema = z
  .union([
    decimalStringSchema,
    z
      .number()
      .nonnegative()
      .transform((value) => value.toString())
      .pipe(decimalStringSchema),
  ])
  .nullable()
  .optional();

const optionalDateSchema = z.string().trim().min(1).nullable().optional();

const currencySchema = z
  .string()
  .trim()
  .length(3)
  .transform((value) => value.toUpperCase())
  .optional();

export const createTripSchema = z
  .object({
    name: z.string().trim().min(1),
    destination: z.string().trim().min(1).nullable().optional(),
    startDate: optionalDateSchema,
    endDate: optionalDateSchema,
    groupId: z.string().trim().min(1).nullable().optional(),
    budget: budgetSchema,
    currency: currencySchema,
  })
  .strict() satisfies z.ZodType<CreateTripRequest>;

export const updateTripSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    destination: z.string().trim().min(1).nullable().optional(),
    startDate: optionalDateSchema,
    endDate: optionalDateSchema,
    status: z.enum(['planning', 'completed', 'cancelled']).optional(),
    budget: budgetSchema,
    currency: currencySchema,
  })
  .strict() satisfies z.ZodType<UpdateTripRequest>;

export const attachTripToGroupSchema = z
  .object({
    groupId: z.string().trim().min(1),
  })
  .strict() satisfies z.ZodType<AttachTripToGroupRequest>;

export const updateTripRsvpSchema = z
  .object({
    status: z.enum(['going', 'maybe', 'not_going']),
  })
  .strict() satisfies z.ZodType<UpdateTripRsvpRequest>;

export type CreateTripDto = z.infer<typeof createTripSchema>;
export type UpdateTripDto = z.infer<typeof updateTripSchema>;
export type AttachTripToGroupDto = z.infer<typeof attachTripToGroupSchema>;
export type UpdateTripRsvpDto = z.infer<typeof updateTripRsvpSchema>;
