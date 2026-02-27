import { DraftStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { requireAdminApiSession } from '@/lib/auth/admin-route';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const adminSession = await requireAdminApiSession(request);
  if (adminSession.response) {
    return adminSession.response;
  }

  const statusQuery = request.nextUrl.searchParams.get('status');
  const statusFilter = statusQuery
    ? (Object.values(DraftStatus).find((status) => status === statusQuery) ??
      undefined)
    : undefined;

  const drafts = await prisma.draft.findMany({
    where: statusFilter ? { status: statusFilter } : undefined,
    include: {
      lead: {
        select: {
          id: true,
          company: true,
          personName: true,
          email: true,
          roleType: true,
        },
      },
      template: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ drafts });
}
