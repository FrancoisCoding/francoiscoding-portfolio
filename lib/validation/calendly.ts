import { z } from 'zod';

import {
  isBookingTimeZone,
  isCalendarMonth,
  normalizeBookingSlot,
} from '@/lib/calendly/calendar';

const bookingTimeZoneSchema = z
  .string()
  .trim()
  .min(1, 'Timezone is required.')
  .refine(isBookingTimeZone, 'Invalid timezone.');

export const calendlyAvailabilityQuerySchema = z.object({
  month: z.string().refine(isCalendarMonth, 'Invalid month value.'),
  timezone: bookingTimeZoneSchema,
});

export const calendlyBookingFormSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  websiteUrl: z
    .string()
    .trim()
    .min(1, 'Please share a website or app link.')
    .url('Enter a valid URL.'),
  budgetRange: z.string().trim().min(1, 'Please choose a budget range.'),
  notes: z
    .string()
    .trim()
    .max(1000, 'Notes are too long.')
    .optional()
    .default(''),
  guests: z
    .array(z.string().trim().email('Guest email must be valid.'))
    .default([]),
});

export const calendlyBookingSubmissionSchema = calendlyBookingFormSchema.extend(
  {
    startTime: z
      .string()
      .trim()
      .min(1, 'Start time is required.')
      .transform((value, context) => {
        const startTime = normalizeBookingSlot(value);

        if (!startTime) {
          context.addIssue({ code: 'custom', message: 'Invalid start time.' });
          return z.NEVER;
        }

        return startTime;
      }),
    timezone: bookingTimeZoneSchema,
  },
);

export type TCalendlyAvailabilityQuery = z.infer<
  typeof calendlyAvailabilityQuerySchema
>;

export type TCalendlyBookingFormValues = z.infer<
  typeof calendlyBookingFormSchema
>;

export type TCalendlyBookingSubmissionValues = z.infer<
  typeof calendlyBookingSubmissionSchema
>;
