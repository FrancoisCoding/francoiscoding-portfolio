import { z } from 'zod';

export const calendlyAvailabilityQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Invalid month value.'),
  timezone: z.string().trim().min(1, 'Timezone is required.'),
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
    startTime: z.string().trim().min(1, 'Start time is required.'),
    timezone: z.string().trim().min(1, 'Timezone is required.'),
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
