'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { Download, Loader2, Plus, Trash2, Upload } from 'lucide-react';
import Papa from 'papaparse';
import { useMemo, useState } from 'react';

import {
  leadCompanyFilterAtom,
  leadSearchAtom,
  leadStatusFilterAtom,
  leadTagFilterAtom,
  leadViewModeAtom,
} from '@/atoms/admin-leads';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { leadStatuses, type TLeadStatus } from '@/lib/admin/lead-constants';
import { adminFetchJson, adminFetchText } from '@/lib/admin/admin-api-client';
import { leadInputSchema } from '@/lib/validation/admin-lead';

interface ILead {
  id: string;
  company: string;
  personName: string;
  email: string;
  roleType: string;
  source: string;
  notes: string | null;
  tags: string[];
  status: TLeadStatus;
  createdAt: string;
  updatedAt: string;
}

interface ILeadFormValues {
  company: string;
  personName: string;
  email: string;
  roleType: string;
  source: string;
  notes: string;
  tags: string;
  status: TLeadStatus;
}

type TCsvMapping = {
  company: string;
  personName: string;
  email: string;
  roleType: string;
  source: string;
  notes?: string;
  tags?: string;
  status?: string;
};

const defaultLeadValues: ILeadFormValues = {
  company: '',
  personName: '',
  email: '',
  roleType: '',
  source: 'manual',
  notes: '',
  tags: '',
  status: 'NEW',
};

function toPayload(values: ILeadFormValues) {
  return {
    company: values.company,
    personName: values.personName,
    email: values.email,
    roleType: values.roleType,
    source: values.source,
    notes: values.notes || null,
    tags: values.tags
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    status: values.status,
  };
}

function buildDefaultMapping(headers: string[]): TCsvMapping {
  const findHeader = (field: string) =>
    headers.find((item) => item.toLowerCase() === field.toLowerCase()) ?? '';

  return {
    company: findHeader('company'),
    personName: findHeader('personName') || findHeader('person_name'),
    email: findHeader('email'),
    roleType: findHeader('roleType') || findHeader('role_type'),
    source: findHeader('source'),
    notes: findHeader('notes'),
    tags: findHeader('tags'),
    status: findHeader('status'),
  };
}

export function LeadsManager() {
  const queryClient = useQueryClient();
  const [searchFilter, setSearchFilter] = useAtom(leadSearchAtom);
  const [companyFilter, setCompanyFilter] = useAtom(leadCompanyFilterAtom);
  const [tagFilter, setTagFilter] = useAtom(leadTagFilterAtom);
  const [statusFilter, setStatusFilter] = useAtom(leadStatusFilterAtom);
  const [viewMode, setViewMode] = useAtom(leadViewModeAtom);

  const [formValues, setFormValues] =
    useState<ILeadFormValues>(defaultLeadValues);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const [csvRaw, setCsvRaw] = useState('');
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvMapping, setCsvMapping] = useState<TCsvMapping>({
    company: '',
    personName: '',
    email: '',
    roleType: '',
    source: '',
  });

  const filterSearchParams = useMemo(() => {
    const params = new URLSearchParams();
    if (searchFilter) params.set('search', searchFilter);
    if (companyFilter) params.set('company', companyFilter);
    if (tagFilter) params.set('tag', tagFilter);
    if (statusFilter !== 'ALL') params.set('status', statusFilter);
    return params.toString();
  }, [searchFilter, companyFilter, tagFilter, statusFilter]);

  const leadsQuery = useQuery({
    queryKey: ['admin-leads', filterSearchParams],
    queryFn: async () => {
      const querySuffix = filterSearchParams ? `?${filterSearchParams}` : '';
      return adminFetchJson<{ leads: ILead[] }>(
        `/api/admin/leads${querySuffix}`,
      );
    },
  });

  const createLeadMutation = useMutation({
    mutationFn: async (values: ILeadFormValues) =>
      adminFetchJson<{ lead: ILead }>('/api/admin/leads', {
        method: 'POST',
        body: JSON.stringify(toPayload(values)),
      }),
    onSuccess: () => {
      setStatusMessage('Lead created successfully.');
      setFormValues(defaultLeadValues);
      setEditingLeadId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
    },
    onError: (error: Error) => setStatusMessage(error.message),
  });

  const updateLeadMutation = useMutation({
    mutationFn: async ({
      leadId,
      values,
    }: {
      leadId: string;
      values: ILeadFormValues;
    }) =>
      adminFetchJson<{ lead: ILead }>(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        body: JSON.stringify(toPayload(values)),
      }),
    onSuccess: () => {
      setStatusMessage('Lead updated successfully.');
      setFormValues(defaultLeadValues);
      setEditingLeadId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
    },
    onError: (error: Error) => setStatusMessage(error.message),
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async (leadId: string) =>
      adminFetchJson<{ success: true }>(`/api/admin/leads/${leadId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      setStatusMessage('Lead deleted.');
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
    },
    onError: (error: Error) => setStatusMessage(error.message),
  });

  const importMutation = useMutation({
    mutationFn: async () =>
      adminFetchJson<{
        importedCount: number;
        failedCount: number;
        errors: Array<{ row: number; message: string }>;
      }>('/api/admin/leads/import', {
        method: 'POST',
        body: JSON.stringify({
          csv: csvRaw,
          mapping: csvMapping,
        }),
      }),
    onSuccess: (payload) => {
      if (payload.failedCount > 0) {
        setStatusMessage(
          `Imported ${payload.importedCount} rows, ${payload.failedCount} failed.`,
        );
      } else {
        setStatusMessage(
          `Imported ${payload.importedCount} rows successfully.`,
        );
      }
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
    },
    onError: (error: Error) => setStatusMessage(error.message),
  });

  const handleFormValueChange = (
    field: keyof ILeadFormValues,
    value: string,
  ) => {
    setFormValues((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmitLead = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage('');

    const validationResult = leadInputSchema.safeParse(toPayload(formValues));
    if (!validationResult.success) {
      const validationMessage = Object.values(
        validationResult.error.flatten().fieldErrors,
      )
        .flat()
        .filter(Boolean)
        .join(' ');
      setStatusMessage(validationMessage || 'Invalid lead values.');
      return;
    }

    if (editingLeadId) {
      updateLeadMutation.mutate({ leadId: editingLeadId, values: formValues });
      return;
    }

    createLeadMutation.mutate(formValues);
  };

  const startEditingLead = (lead: ILead) => {
    setEditingLeadId(lead.id);
    setFormValues({
      company: lead.company,
      personName: lead.personName,
      email: lead.email,
      roleType: lead.roleType,
      source: lead.source,
      notes: lead.notes ?? '',
      tags: lead.tags.join(', '),
      status: lead.status,
    });
  };

  const handleCsvFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const csvText = await file.text();
    const parsed = Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    const headers = parsed.meta.fields ?? [];
    setCsvRaw(csvText);
    setCsvHeaders(headers);
    setCsvMapping(buildDefaultMapping(headers));
    setStatusMessage('');
  };

  const handleCsvMappingChange = (field: keyof TCsvMapping, value: string) => {
    setCsvMapping((previous) => ({ ...previous, [field]: value }));
  };

  const handleExportCsv = async () => {
    setStatusMessage('');
    try {
      const csv = await adminFetchText('/api/admin/leads/export');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = 'leads-export.csv';
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'Unable to export leads.',
      );
    }
  };

  const leads = leadsQuery.data?.leads ?? [];
  const isSavingLead =
    createLeadMutation.isPending || updateLeadMutation.isPending;

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-semibold text-slate-950 dark:text-white">
          Leads
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Manage leads, import/export CSV, and filter by status, tag, company,
          or search terms.
        </p>
      </div>

      <form
        onSubmit={handleSubmitLead}
        className="space-y-4 rounded-xl border border-black/10 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <Input
            placeholder="Company"
            value={formValues.company}
            onChange={(event) =>
              handleFormValueChange('company', event.target.value)
            }
          />
          <Input
            placeholder="Person Name"
            value={formValues.personName}
            onChange={(event) =>
              handleFormValueChange('personName', event.target.value)
            }
          />
          <Input
            placeholder="Email"
            type="email"
            value={formValues.email}
            onChange={(event) =>
              handleFormValueChange('email', event.target.value)
            }
          />
          <Input
            placeholder="Role Type"
            value={formValues.roleType}
            onChange={(event) =>
              handleFormValueChange('roleType', event.target.value)
            }
          />
          <Input
            placeholder="Source"
            value={formValues.source}
            onChange={(event) =>
              handleFormValueChange('source', event.target.value)
            }
          />
          <select
            className="h-11 rounded-md border border-black/10 bg-white/90 px-3 text-sm dark:border-white/15 dark:bg-slate-950/70"
            value={formValues.status}
            onChange={(event) =>
              handleFormValueChange('status', event.target.value as TLeadStatus)
            }
          >
            {leadStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <Input
            placeholder="Tags (comma separated)"
            value={formValues.tags}
            onChange={(event) =>
              handleFormValueChange('tags', event.target.value)
            }
            className="md:col-span-2"
          />
          <Textarea
            placeholder="Notes"
            value={formValues.notes}
            onChange={(event) =>
              handleFormValueChange('notes', event.target.value)
            }
            className="md:col-span-2"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={isSavingLead}>
            {isSavingLead ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Plus className="size-4" />
                {editingLeadId ? 'Update Lead' : 'Create Lead'}
              </>
            )}
          </Button>
          {editingLeadId ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditingLeadId(null);
                setFormValues(defaultLeadValues);
              }}
            >
              Cancel Edit
            </Button>
          ) : null}
          <Button type="button" variant="secondary" onClick={handleExportCsv}>
            <Download className="size-4" />
            Export CSV
          </Button>
        </div>
      </form>

      <div className="space-y-4 rounded-xl border border-black/10 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5">
        <p className="text-sm font-semibold">Filters & View</p>
        <div className="grid gap-3 md:grid-cols-5">
          <Input
            placeholder="Search"
            value={searchFilter}
            onChange={(event) => setSearchFilter(event.target.value)}
          />
          <Input
            placeholder="Company"
            value={companyFilter}
            onChange={(event) => setCompanyFilter(event.target.value)}
          />
          <Input
            placeholder="Tag"
            value={tagFilter}
            onChange={(event) => setTagFilter(event.target.value)}
          />
          <select
            className="h-11 rounded-md border border-black/10 bg-white/90 px-3 text-sm dark:border-white/15 dark:bg-slate-950/70"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as TLeadStatus | 'ALL')
            }
          >
            <option value="ALL">ALL</option>
            {leadStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            className="h-11 rounded-md border border-black/10 bg-white/90 px-3 text-sm dark:border-white/15 dark:bg-slate-950/70"
            value={viewMode}
            onChange={(event) =>
              setViewMode(event.target.value as 'table' | 'cards')
            }
          >
            <option value="table">Table</option>
            <option value="cards">Cards</option>
          </select>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-black/10 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5">
        <p className="text-sm font-semibold">CSV Import</p>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={handleCsvFileUpload}
          className="block w-full text-sm"
        />
        {csvHeaders.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2">
            {(
              [
                'company',
                'personName',
                'email',
                'roleType',
                'source',
                'notes',
                'tags',
                'status',
              ] as Array<keyof TCsvMapping>
            ).map((field) => (
              <label key={field} className="space-y-1 text-sm">
                <span>{field}</span>
                <select
                  className="h-11 w-full rounded-md border border-black/10 bg-white/90 px-3 text-sm dark:border-white/15 dark:bg-slate-950/70"
                  value={csvMapping[field] ?? ''}
                  onChange={(event) =>
                    handleCsvMappingChange(field, event.target.value)
                  }
                >
                  <option value="">Not mapped</option>
                  {csvHeaders.map((header) => (
                    <option key={`${field}-${header}`} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        ) : null}
        <Button
          type="button"
          variant="secondary"
          disabled={!csvRaw || importMutation.isPending}
          onClick={() => importMutation.mutate()}
        >
          {importMutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Upload className="size-4" />
              Import CSV
            </>
          )}
        </Button>
      </div>

      {statusMessage ? (
        <p className="text-sm text-slate-700 dark:text-slate-200">
          {statusMessage}
        </p>
      ) : null}

      <div className="rounded-xl border border-black/10 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5">
        {leadsQuery.isLoading ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading leads...
          </p>
        ) : null}
        {leadsQuery.isError ? (
          <p className="text-sm text-rose-600 dark:text-rose-300">
            {leadsQuery.error instanceof Error
              ? leadsQuery.error.message
              : 'Unable to load leads.'}
          </p>
        ) : null}
        {!leadsQuery.isLoading && !leadsQuery.isError ? (
          viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead>
                  <tr className="border-b border-black/10 dark:border-white/10">
                    <th className="py-3 pr-3">Company</th>
                    <th className="py-3 pr-3">Person</th>
                    <th className="py-3 pr-3">Email</th>
                    <th className="py-3 pr-3">Role</th>
                    <th className="py-3 pr-3">Source</th>
                    <th className="py-3 pr-3">Status</th>
                    <th className="py-3 pr-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-black/5 dark:border-white/5"
                    >
                      <td className="py-3 pr-3">{lead.company}</td>
                      <td className="py-3 pr-3">{lead.personName}</td>
                      <td className="py-3 pr-3">{lead.email}</td>
                      <td className="py-3 pr-3">{lead.roleType}</td>
                      <td className="py-3 pr-3">{lead.source}</td>
                      <td className="py-3 pr-3">{lead.status}</td>
                      <td className="py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => startEditingLead(lead)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => deleteLeadMutation.mutate(lead.id)}
                            disabled={deleteLeadMutation.isPending}
                          >
                            <Trash2 className="size-4" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="space-y-2 rounded-lg border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/50"
                >
                  <p className="font-semibold">{lead.company}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {lead.personName} • {lead.roleType}
                  </p>
                  <p className="text-sm">{lead.email}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {lead.tags.join(', ')}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => startEditingLead(lead)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => deleteLeadMutation.mutate(lead.id)}
                      disabled={deleteLeadMutation.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : null}
      </div>
    </section>
  );
}
