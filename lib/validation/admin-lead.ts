import { z } from 'zod';

import { leadStatuses } from '@/lib/admin/lead-constants';

export const leadStatusSchema = z.enum(leadStatuses);

export const leadInputSchema = z.object({
  company: z.string().trim().min(1, 'Company is required.'),
  personName: z.string().trim().min(1, 'Person name is required.'),
  email: z.string().trim().email('A valid email is required.'),
  roleType: z.string().trim().min(1, 'Role type is required.'),
  source: z.string().trim().min(1, 'Source is required.'),
  notes: z.string().trim().optional().nullable(),
  tags: z.array(z.string().trim()).default([]),
  status: leadStatusSchema.default('NEW'),
});

export const leadUpdateSchema = leadInputSchema.partial();

export const leadFiltersSchema = z.object({
  search: z.string().trim().optional(),
  company: z.string().trim().optional(),
  status: leadStatusSchema.optional(),
  tag: z.string().trim().optional(),
});

export const csvImportRequestSchema = z.object({
  csv: z.string().min(1, 'CSV input is required.'),
  mapping: z.object({
    company: z.string().min(1),
    personName: z.string().min(1),
    email: z.string().min(1),
    roleType: z.string().min(1),
    source: z.string().min(1),
    notes: z.string().optional(),
    tags: z.string().optional(),
    status: z.string().optional(),
  }),
});

export type TLeadInputValues = z.infer<typeof leadInputSchema>;
export type TLeadUpdateValues = z.infer<typeof leadUpdateSchema>;
