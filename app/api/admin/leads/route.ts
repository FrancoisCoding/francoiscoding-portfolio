import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { requireAdminApiSession } from '@/lib/auth/admin-route';
import { prisma } from '@/lib/prisma';
import {
  leadFiltersSchema,
  leadInputSchema,
} from '@/lib/validation/admin-lead';

function normalizeTags(tags: string[]) {
  return tags
    .map((tag) => tag.trim())
    .filter(Boolean)
    .filter((tag, index, array) => array.indexOf(tag) === index);
}

export async function GET(request: NextRequest) {
  const adminSession = await requireAdminApiSession(request);
  if (adminSession.response) {
    return adminSession.response;
  }

  const filtersResult = leadFiltersSchema.safeParse({
    search: request.nextUrl.searchParams.get('search') ?? undefined,
    company: request.nextUrl.searchParams.get('company') ?? undefined,
    status: request.nextUrl.searchParams.get('status') ?? undefined,
    tag: request.nextUrl.searchParams.get('tag') ?? undefined,
  });

  if (!filtersResult.success) {
    return NextResponse.json(
      { error: 'Invalid filters provided.' },
      { status: 400 },
    );
  }

  const { search, company, status, tag } = filtersResult.data;
  const where: Prisma.LeadWhereInput = {};

  if (search) {
    where.OR = [
      { company: { contains: search, mode: 'insensitive' } },
      { personName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { roleType: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (company) {
    where.company = { contains: company, mode: 'insensitive' };
  }

  if (status) {
    where.status = status;
  }

  if (tag) {
    where.tags = { has: tag };
  }

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ leads });
}

export async function POST(request: NextRequest) {
  const adminSession = await requireAdminApiSession(request);
  if (adminSession.response) {
    return adminSession.response;
  }

  const body = await request.json();
  const validationResult = leadInputSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        error: 'Invalid lead input.',
        issues: validationResult.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const leadValues = validationResult.data;
  const lead = await prisma.lead.create({
    data: {
      ...leadValues,
      notes: leadValues.notes ?? null,
      tags: normalizeTags(leadValues.tags),
    },
  });

  return NextResponse.json({ lead }, { status: 201 });
}
