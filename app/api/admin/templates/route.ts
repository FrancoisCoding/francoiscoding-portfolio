import { NextRequest, NextResponse } from 'next/server';

import { requireAdminApiSession } from '@/lib/auth/admin-route';
import { prisma } from '@/lib/prisma';
import { templateInputSchema } from '@/lib/validation/admin-template';

export async function GET(request: NextRequest) {
  const adminSession = await requireAdminApiSession(request);
  if (adminSession.response) {
    return adminSession.response;
  }

  const templates = await prisma.template.findMany({
    orderBy: { createdAt: 'desc' },
  });
  const sampleLead = await prisma.lead.findFirst({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ templates, sampleLead });
}

export async function POST(request: NextRequest) {
  const adminSession = await requireAdminApiSession(request);
  if (adminSession.response) {
    return adminSession.response;
  }

  const body = await request.json();
  const validationResult = templateInputSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        error: 'Invalid template values.',
        issues: validationResult.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const template = await prisma.template.create({
    data: validationResult.data,
  });

  return NextResponse.json({ template }, { status: 201 });
}
