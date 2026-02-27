import { z } from 'zod';

import { outreachTemplateVariables } from '@/lib/admin/template-variables';

export const templateVariableSchema = z.enum(outreachTemplateVariables);

export const templateInputSchema = z.object({
  name: z.string().trim().min(1, 'Template name is required.'),
  subject: z.string().trim().min(1, 'Subject is required.'),
  body: z.string().trim().min(1, 'Body is required.'),
  variables: z.array(templateVariableSchema).default([]),
});

export const templateUpdateSchema = templateInputSchema.partial();
