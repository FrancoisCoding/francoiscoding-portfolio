import { z } from 'zod';

export const draftGenerateSchema = z.object({
  leadId: z.string().trim().min(1, 'Lead is required.'),
  templateId: z.string().trim().min(1, 'Template is required.'),
  highlight: z.string().trim().optional().default(''),
});

export const draftUpdateSchema = z.object({
  subject: z.string().trim().min(1).optional(),
  body: z.string().trim().min(1).optional(),
  status: z.enum(['QUEUED', 'APPROVED', 'SENT']).optional(),
});
