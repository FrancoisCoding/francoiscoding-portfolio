export const leadStatuses = [
  'NEW',
  'QUALIFIED',
  'CONTACTED',
  'RESPONDED',
  'CLOSED_ARCHIVED',
] as const;

export type TLeadStatus = (typeof leadStatuses)[number];
