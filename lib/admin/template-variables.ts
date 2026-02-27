export const outreachTemplateVariables = [
  '{company}',
  '{personName}',
  '{roleType}',
  '{financeflow}',
  '{github}',
  '{highlight}',
] as const;

export type TOutreachTemplateVariable =
  (typeof outreachTemplateVariables)[number];
