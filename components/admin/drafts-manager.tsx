'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { adminFetchJson } from '@/lib/admin/admin-api-client';

interface ILeadOption {
  id: string;
  company: string;
  personName: string;
}

interface ITemplateOption {
  id: string;
  name: string;
}

interface IDraftItem {
  id: string;
  subject: string;
  body: string;
  status: 'QUEUED' | 'APPROVED' | 'SENT';
  lead: {
    company: string;
    personName: string;
    email: string;
  };
  template: {
    name: string;
  } | null;
}

interface IDraftEditValues {
  subject: string;
  body: string;
}

export function DraftsManager() {
  const queryClient = useQueryClient();
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [highlight, setHighlight] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [draftEdits, setDraftEdits] = useState<
    Record<string, IDraftEditValues>
  >({});

  const leadsQuery = useQuery({
    queryKey: ['admin-draft-lead-options'],
    queryFn: () => adminFetchJson<{ leads: ILeadOption[] }>('/api/admin/leads'),
  });

  const templatesQuery = useQuery({
    queryKey: ['admin-draft-template-options'],
    queryFn: () =>
      adminFetchJson<{ templates: ITemplateOption[] }>('/api/admin/templates'),
  });

  const draftsQuery = useQuery({
    queryKey: ['admin-drafts-queued'],
    queryFn: () =>
      adminFetchJson<{ drafts: IDraftItem[] }>(
        '/api/admin/drafts?status=QUEUED',
      ),
  });

  const approvedDraftsQuery = useQuery({
    queryKey: ['admin-drafts-approved'],
    queryFn: () =>
      adminFetchJson<{ drafts: IDraftItem[] }>(
        '/api/admin/drafts?status=APPROVED',
      ),
  });

  const generateMutation = useMutation({
    mutationFn: async () =>
      adminFetchJson('/api/admin/drafts/generate', {
        method: 'POST',
        body: JSON.stringify({
          leadId: selectedLeadId,
          templateId: selectedTemplateId,
          highlight,
        }),
      }),
    onSuccess: () => {
      setStatusMessage('Draft generated and queued for review.');
      setHighlight('');
      queryClient.invalidateQueries({ queryKey: ['admin-drafts-queued'] });
    },
    onError: (error: Error) => setStatusMessage(error.message),
  });

  const updateDraftMutation = useMutation({
    mutationFn: async ({
      draftId,
      values,
    }: {
      draftId: string;
      values: IDraftEditValues;
    }) =>
      adminFetchJson(`/api/admin/drafts/${draftId}`, {
        method: 'PATCH',
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      setStatusMessage('Draft updated.');
      queryClient.invalidateQueries({ queryKey: ['admin-drafts-queued'] });
    },
    onError: (error: Error) => setStatusMessage(error.message),
  });

  const approveDraftMutation = useMutation({
    mutationFn: async ({
      draftId,
      values,
    }: {
      draftId: string;
      values: IDraftEditValues;
    }) =>
      adminFetchJson(`/api/admin/drafts/${draftId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...values,
          status: 'APPROVED',
        }),
      }),
    onSuccess: () => {
      setStatusMessage('Draft approved.');
      queryClient.invalidateQueries({ queryKey: ['admin-drafts-queued'] });
      queryClient.invalidateQueries({ queryKey: ['admin-drafts-approved'] });
    },
    onError: (error: Error) => setStatusMessage(error.message),
  });

  const sendDraftMutation = useMutation({
    mutationFn: async (draftId: string) =>
      adminFetchJson(`/api/admin/drafts/${draftId}/send`, {
        method: 'POST',
      }),
    onSuccess: () => {
      setStatusMessage('Approved draft sent.');
      queryClient.invalidateQueries({ queryKey: ['admin-drafts-approved'] });
      queryClient.invalidateQueries({ queryKey: ['admin-drafts-queued'] });
    },
    onError: (error: Error) => setStatusMessage(error.message),
  });

  const leads = leadsQuery.data?.leads ?? [];
  const templates = templatesQuery.data?.templates ?? [];
  const queuedDrafts = draftsQuery.data?.drafts ?? [];
  const approvedDrafts = approvedDraftsQuery.data?.drafts ?? [];

  const canGenerate = Boolean(selectedLeadId && selectedTemplateId);
  const selectedLeadLabel = leads.find((lead) => lead.id === selectedLeadId);

  const getDraftValues = (draft: IDraftItem): IDraftEditValues => {
    return (
      draftEdits[draft.id] ?? {
        subject: draft.subject,
        body: draft.body,
      }
    );
  };

  const setDraftValue = (
    draftId: string,
    field: keyof IDraftEditValues,
    value: string,
  ) => {
    setDraftEdits((previous) => {
      const existingValues = previous[draftId] ?? { subject: '', body: '' };
      return {
        ...previous,
        [draftId]: {
          ...existingValues,
          [field]: value,
        },
      };
    });
  };

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-semibold text-slate-950 dark:text-white">
          Drafts
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Generate AI-assisted drafts from lead + template context, edit draft
          copy, and approve before any send action.
        </p>
      </div>

      <div className="space-y-4 rounded-xl border border-black/10 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5">
        <p className="text-sm font-semibold">Generate Draft</p>
        <div className="grid gap-3 md:grid-cols-2">
          <select
            className="h-11 rounded-md border border-black/10 bg-white/90 px-3 text-sm dark:border-white/15 dark:bg-slate-950/70"
            value={selectedLeadId}
            onChange={(event) => setSelectedLeadId(event.target.value)}
          >
            <option value="">Select lead</option>
            {leads.map((lead) => (
              <option key={lead.id} value={lead.id}>
                {lead.company} - {lead.personName}
              </option>
            ))}
          </select>
          <select
            className="h-11 rounded-md border border-black/10 bg-white/90 px-3 text-sm dark:border-white/15 dark:bg-slate-950/70"
            value={selectedTemplateId}
            onChange={(event) => setSelectedTemplateId(event.target.value)}
          >
            <option value="">Select template</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          <Input
            value={highlight}
            onChange={(event) => setHighlight(event.target.value)}
            placeholder="Optional highlight notes"
            className="md:col-span-2"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            disabled={!canGenerate || generateMutation.isPending}
            onClick={() => generateMutation.mutate()}
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Generate Draft
              </>
            )}
          </Button>
          {selectedLeadLabel ? (
            <p className="inline-flex items-center text-xs text-slate-600 dark:text-slate-300">
              Target: {selectedLeadLabel.company} /{' '}
              {selectedLeadLabel.personName}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-semibold">Queued Drafts</p>
        {draftsQuery.isLoading ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading queued drafts...
          </p>
        ) : null}
        <div className="space-y-4">
          {queuedDrafts.map((draft) => {
            const draftValues = getDraftValues(draft);
            return (
              <article
                key={draft.id}
                className="space-y-3 rounded-xl border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold">
                    {draft.lead.company} - {draft.lead.personName}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {draft.lead.email} • Template:{' '}
                    {draft.template?.name ?? 'None'}
                  </p>
                </div>
                <Input
                  value={draftValues.subject}
                  onChange={(event) =>
                    setDraftValue(draft.id, 'subject', event.target.value)
                  }
                />
                <Textarea
                  value={draftValues.body}
                  onChange={(event) =>
                    setDraftValue(draft.id, 'body', event.target.value)
                  }
                  className="min-h-[180px]"
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      updateDraftMutation.mutate({
                        draftId: draft.id,
                        values: draftValues,
                      })
                    }
                    disabled={updateDraftMutation.isPending}
                  >
                    Save Edit
                  </Button>
                  <Button
                    onClick={() =>
                      approveDraftMutation.mutate({
                        draftId: draft.id,
                        values: draftValues,
                      })
                    }
                    disabled={approveDraftMutation.isPending}
                  >
                    <CheckCircle2 className="size-4" />
                    Approve
                  </Button>
                </div>
              </article>
            );
          })}
          {queuedDrafts.length === 0 && !draftsQuery.isLoading ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              No queued drafts yet.
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2 rounded-xl border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
        <p className="text-sm font-semibold">Approved Drafts</p>
        {approvedDrafts.map((draft) => (
          <div
            key={draft.id}
            className="space-y-2 rounded-md border border-black/10 bg-white/80 p-3 text-sm dark:border-white/10 dark:bg-slate-950/50"
          >
            <p className="font-semibold">{draft.subject}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {draft.lead.company} - {draft.lead.personName}
            </p>
            <Button
              size="sm"
              onClick={() => sendDraftMutation.mutate(draft.id)}
              disabled={sendDraftMutation.isPending}
            >
              {sendDraftMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send'
              )}
            </Button>
          </div>
        ))}
        {approvedDrafts.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            No approved drafts yet.
          </p>
        ) : null}
      </div>

      {statusMessage ? (
        <p className="text-sm text-slate-700 dark:text-slate-200">
          {statusMessage}
        </p>
      ) : null}
    </section>
  );
}
