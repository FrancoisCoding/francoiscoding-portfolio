import Papa from 'papaparse';
import { NextRequest, NextResponse } from 'next/server';

import { requireAdminApiSession } from '@/lib/auth/admin-route';
import { leadStatuses } from '@/lib/admin/lead-constants';
import { prisma } from '@/lib/prisma';
import {
  csvImportRequestSchema,
  leadInputSchema,
} from '@/lib/validation/admin-lead';

function normalizeTags(rawValue: string | undefined) {
  if (!rawValue) {
    return [];
  }

  return rawValue
    .split(/[;,]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .filter((tag, index, array) => array.indexOf(tag) === index);
}

export async function POST(request: NextRequest) {
  const adminSession = await requireAdminApiSession(request);
  if (adminSession.response) {
    return adminSession.response;
  }

  const body = await request.json();
  const importRequest = csvImportRequestSchema.safeParse(body);

  if (!importRequest.success) {
    return NextResponse.json(
      {
        error: 'Invalid CSV import request.',
        issues: importRequest.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { csv, mapping } = importRequest.data;
  const parsedCsv = Papa.parse<Record<string, string>>(csv, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsedCsv.errors.length > 0) {
    return NextResponse.json(
      {
        error: 'CSV parse failed.',
        issues: parsedCsv.errors.map((item) => item.message),
      },
      { status: 400 },
    );
  }

  const inputRows = parsedCsv.data;
  const validRows: Array<ReturnType<typeof leadInputSchema.parse>> = [];
  const invalidRows: Array<{ row: number; message: string }> = [];

  inputRows.forEach((rowData, index) => {
    const mappedStatus = mapping.status ? rowData[mapping.status] : undefined;
    const normalizedStatus = mappedStatus
      ? mappedStatus.trim().toUpperCase()
      : 'NEW';

    const validationResult = leadInputSchema.safeParse({
      company: rowData[mapping.company] ?? '',
      personName: rowData[mapping.personName] ?? '',
      email: rowData[mapping.email] ?? '',
      roleType: rowData[mapping.roleType] ?? '',
      source: rowData[mapping.source] ?? '',
      notes: mapping.notes ? rowData[mapping.notes] : undefined,
      tags: normalizeTags(mapping.tags ? rowData[mapping.tags] : undefined),
      status: leadStatuses.includes(
        normalizedStatus as (typeof leadStatuses)[number],
      )
        ? normalizedStatus
        : 'NEW',
    });

    if (!validationResult.success) {
      const message = Object.values(
        validationResult.error.flatten().fieldErrors,
      )
        .flat()
        .filter(Boolean)
        .join(' ');
      invalidRows.push({
        row: index + 2,
        message: message || 'Invalid row values.',
      });
      return;
    }

    validRows.push(validationResult.data);
  });

  if (validRows.length > 0) {
    await prisma.lead.createMany({
      data: validRows.map((item) => ({
        ...item,
        notes: item.notes ?? null,
      })),
    });
  }

  return NextResponse.json({
    importedCount: validRows.length,
    failedCount: invalidRows.length,
    errors: invalidRows,
  });
}
