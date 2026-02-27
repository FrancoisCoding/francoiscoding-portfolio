'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { adminFetchJson } from '@/lib/admin/admin-api-client';
import { outreachTemplateVariables } from '@/lib/admin/template-variables';
import { siteConfig } from '@/lib/site-config';
import { templateInputSchema } from '@/lib/validation/admin-template';

interface ITemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

interface ISampleLead {
  company: string;
  personName: string;
  roleType: string;
}

interface ITemplateFormValues {
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

const defaultTemplateValues: ITemplateFormValues = {
  name: '',
  subject: '',
  body: '',
  variables: [],
};

function renderPreview(
  text: string,
  values: {
    company: string;
    personName: string;
    roleType: string;
    highlight: string;
  },
) {
  return text
    .replaceAll('{company}', values.company)
    .replaceAll('{personName}', values.personName)
    .replaceAll('{roleType}', values.roleType)
    .replaceAll('{financeflow}', siteConfig.financeFlowUrl)
    .replaceAll('{github}', siteConfig.githubUrl)
    .replaceAll('{highlight}', values.highlight || '[highlight]');
}

export function TemplatesManager() {
  const queryClient = useQueryClient();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );
  const [formValues, setFormValues] = useState<ITemplateFormValues>(
    defaultTemplateValues,
  );
  const [previewHighlight, setPreviewHighlight] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const templatesQuery = useQuery({
    queryKey: ['admin-templates'],
    queryFn: () =>
      adminFetchJson<{
        templates: ITemplate[];
        sampleLead: ISampleLead | null;
      }>('/api/admin/templates'),
  });

  const createMutation = useMutation({
    mutationFn: async (values: ITemplateFormValues) =>
      adminFetchJson<{ template: ITemplate }>('/api/admin/templates', {
        method: 'POST',
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      setStatusMessage('Template created.');
      setFormValues(defaultTemplateValues);
      setSelectedTemplateId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-templates'] });
    },
    onError: (error: Error) => setStatusMessage(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      templateId,
      values,
    }: {
      templateId: string;
      values: ITemplateFormValues;
    }) =>
      adminFetchJson<{ template: ITemplate }>(
        `/api/admin/templates/${templateId}`,
        {
          method: 'PATCH',
          body: JSON.stringify(values),
        },
      ),
    onSuccess: () => {
      setStatusMessage('Template updated.');
      queryClient.invalidateQueries({ queryKey: ['admin-templates'] });
    },
    onError: (error: Error) => setStatusMessage(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (templateId: string) =>
      adminFetchJson<{ success: true }>(`/api/admin/templates/${templateId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      setStatusMessage('Template deleted.');
      setFormValues(defaultTemplateValues);
      setSelectedTemplateId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-templates'] });
    },
    onError: (error: Error) => setStatusMessage(error.message),
  });

  const templates = templatesQuery.data?.templates ?? [];
  const sampleLead = templatesQuery.data?.sampleLead;

  const previewValues = useMemo(
    () => ({
      company: sampleLead?.company ?? '[company]',
      personName: sampleLead?.personName ?? '[personName]',
      roleType: sampleLead?.roleType ?? '[roleType]',
      highlight: previewHighlight || '[highlight]',
    }),
    [previewHighlight, sampleLead],
  );

  const handleTemplateSelect = (template: ITemplate) => {
    setSelectedTemplateId(template.id);
    setFormValues({
      name: template.name,
      subject: template.subject,
      body: template.body,
      variables: template.variables,
    });
  };

  const toggleTemplateVariable = (variable: string) => {
    setFormValues((previous) => {
      const includesVariable = previous.variables.includes(variable);
      return {
        ...previous,
        variables: includesVariable
          ? previous.variables.filter((item) => item !== variable)
          : [...previous.variables, variable],
      };
    });
  };

  const insertVariableIntoBody = (variable: string) => {
    setFormValues((previous) => ({
      ...previous,
      body: previous.body ? `${previous.body} ${variable}` : variable,
    }));
    if (!formValues.variables.includes(variable)) {
      toggleTemplateVariable(variable);
    }
  };

  const handleSaveTemplate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage('');

    const validationResult = templateInputSchema.safeParse(formValues);
    if (!validationResult.success) {
      const message = Object.values(
        validationResult.error.flatten().fieldErrors,
      )
        .flat()
        .filter(Boolean)
        .join(' ');
      setStatusMessage(message || 'Invalid template values.');
      return;
    }

    if (selectedTemplateId) {
      updateMutation.mutate({
        templateId: selectedTemplateId,
        values: validationResult.data,
      });
      return;
    }

    createMutation.mutate(validationResult.data);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-semibold text-slate-950 dark:text-white">
          Templates
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Build and manage outreach templates with variable helpers and live
          preview.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_1fr_1fr]">
        <aside className="space-y-3 rounded-xl border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Saved Templates</p>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setSelectedTemplateId(null);
                setFormValues(defaultTemplateValues);
              }}
            >
              <Plus className="size-4" />
              New
            </Button>
          </div>
          <div className="space-y-2">
            {templatesQuery.isLoading ? (
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Loading templates...
              </p>
            ) : null}
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => handleTemplateSelect(template)}
                className="w-full rounded-md border border-black/10 bg-white/80 p-3 text-left text-sm hover:bg-black/5 dark:border-white/10 dark:bg-slate-950/50 dark:hover:bg-white/10"
              >
                <p className="font-semibold">{template.name}</p>
                <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">
                  {template.subject}
                </p>
              </button>
            ))}
          </div>
        </aside>

        <form
          onSubmit={handleSaveTemplate}
          className="space-y-4 rounded-xl border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={formValues.name}
              onChange={(event) =>
                setFormValues((previous) => ({
                  ...previous,
                  name: event.target.value,
                }))
              }
              placeholder="Template name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <Input
              value={formValues.subject}
              onChange={(event) =>
                setFormValues((previous) => ({
                  ...previous,
                  subject: event.target.value,
                }))
              }
              placeholder="Template subject"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Body</label>
            <Textarea
              value={formValues.body}
              onChange={(event) =>
                setFormValues((previous) => ({
                  ...previous,
                  body: event.target.value,
                }))
              }
              className="min-h-[280px]"
              placeholder="Compose template body..."
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Variable Helper</p>
            <div className="flex flex-wrap gap-2">
              {outreachTemplateVariables.map((variable) => {
                const isSelected = formValues.variables.includes(variable);
                return (
                  <button
                    key={variable}
                    type="button"
                    className={`rounded-full border px-3 py-1 text-xs ${
                      isSelected
                        ? 'border-[var(--brand)] bg-[var(--brand)]/10 text-[var(--brand)]'
                        : 'border-black/10 text-slate-700 dark:border-white/15 dark:text-slate-200'
                    }`}
                    onClick={() => {
                      toggleTemplateVariable(variable);
                      insertVariableIntoBody(variable);
                    }}
                  >
                    {variable}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  {selectedTemplateId ? 'Update Template' : 'Create Template'}
                </>
              )}
            </Button>
            {selectedTemplateId ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => deleteMutation.mutate(selectedTemplateId)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            ) : null}
          </div>
        </form>

        <div className="space-y-4 rounded-xl border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-sm font-semibold">Live Preview</p>
          <div className="space-y-2">
            <label className="text-sm font-medium">Sample highlight</label>
            <Input
              value={previewHighlight}
              onChange={(event) => setPreviewHighlight(event.target.value)}
              placeholder="Optional highlight context"
            />
          </div>
          <div className="space-y-2 rounded-lg border border-black/10 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-950/50">
            <p className="text-xs font-semibold tracking-[0.1em] text-slate-500 uppercase dark:text-slate-400">
              Subject
            </p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {renderPreview(formValues.subject || '[subject]', previewValues)}
            </p>
          </div>
          <div className="space-y-2 rounded-lg border border-black/10 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-950/50">
            <p className="text-xs font-semibold tracking-[0.1em] text-slate-500 uppercase dark:text-slate-400">
              Body
            </p>
            <pre className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-200">
              {renderPreview(formValues.body || '[body]', previewValues)}
            </pre>
          </div>
          {!sampleLead ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No lead exists yet, so placeholder values are shown.
            </p>
          ) : null}
        </div>
      </div>

      {statusMessage ? (
        <p className="text-sm text-slate-700 dark:text-slate-200">
          {statusMessage}
        </p>
      ) : null}
    </section>
  );
}
