import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
  email: z.string().trim().email('Enter a valid email address.'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters.'),
});

export const contactSubmissionSchema = contactFormSchema.extend({
  turnstileToken: z
    .string()
    .trim()
    .min(1, 'Please complete the spam verification challenge.'),
});

export type TContactFormValues = z.infer<typeof contactFormSchema>;
export type TContactSubmissionValues = z.infer<typeof contactSubmissionSchema>;
