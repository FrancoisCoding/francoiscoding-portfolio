import Papa from 'papaparse';
import { NextRequest, NextResponse } from 'next/server';

import { requireAdminApiSession } from '@/lib/auth/admin-route';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const adminSession = await requireAdminApiSession(request);
  if (adminSession.response) {
    return adminSession.response;
  }

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const csv = Papa.unparse(
    leads.map((lead) => ({
      company: lead.company,
      personName: lead.personName,
      email: lead.email,
      roleType: lead.roleType,
      source: lead.source,
      notes: lead.notes ?? '',
      tags: lead.tags.join(', '),
      status: lead.status,
      createdAt: lead.createdAt.toISOString(),
      updatedAt: lead.updatedAt.toISOString(),
    })),
  );

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename=leads-export.csv',
    },
  });
}
