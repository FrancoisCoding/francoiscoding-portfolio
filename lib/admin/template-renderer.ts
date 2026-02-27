import type { Lead, Template } from '@prisma/client';

import { siteConfig } from '@/lib/site-config';

interface IRenderTemplateInput {
  lead: Pick<Lead, 'company' | 'personName' | 'roleType'>;
  template: Pick<Template, 'subject' | 'body'>;
  highlight: string;
}

function replaceTemplateVariables(
  text: string,
  values: Record<string, string>,
) {
  return Object.entries(values).reduce((updatedText, [variable, value]) => {
    return updatedText.replaceAll(variable, value);
  }, text);
}

export function renderDraftFromTemplate({
  lead,
  template,
  highlight,
}: IRenderTemplateInput) {
  const variableValues = {
    '{company}': lead.company,
    '{personName}': lead.personName,
    '{roleType}': lead.roleType,
    '{financeflow}': siteConfig.financeFlowUrl,
    '{github}': siteConfig.githubUrl,
    '{highlight}': highlight || '',
  };

  return {
    subject: replaceTemplateVariables(template.subject, variableValues).trim(),
    body: replaceTemplateVariables(template.body, variableValues).trim(),
  };
}

export async function generateDraftWithOptionalAi({
  lead,
  template,
  highlight,
}: IRenderTemplateInput) {
  const fallbackDraft = renderDraftFromTemplate({ lead, template, highlight });
  const openAiApiKey = process.env.OPENAI_API_KEY;

  if (!openAiApiKey) {
    return fallbackDraft;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: [
          {
            role: 'system',
            content:
              'Write concise professional outreach copy. Return JSON with "subject" and "body".',
          },
          {
            role: 'user',
            content: `Lead company: ${lead.company}
Lead person: ${lead.personName}
Role type: ${lead.roleType}
Highlight: ${highlight || 'N/A'}
Template subject: ${template.subject}
Template body: ${template.body}
FinanceFlow URL: ${siteConfig.financeFlowUrl}
GitHub URL: ${siteConfig.githubUrl}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return fallbackDraft;
    }

    const payload = (await response.json()) as { output_text?: string };
    const outputText = payload.output_text ?? '';
    const parsedPayload = JSON.parse(outputText) as {
      subject?: string;
      body?: string;
    };

    if (!parsedPayload.subject || !parsedPayload.body) {
      return fallbackDraft;
    }

    return {
      subject: parsedPayload.subject.trim(),
      body: parsedPayload.body.trim(),
    };
  } catch {
    return fallbackDraft;
  }
}
