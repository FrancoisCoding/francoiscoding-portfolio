import { NextRequest, NextResponse } from 'next/server';

import { requireAdminApiSession } from '@/lib/auth/admin-route';
import { prisma } from '@/lib/prisma';
import { leadUpdateSchema } from '@/lib/validation/admin-lead';

function normalizeTags(tags: string[]) {
  return tags
    .map((tag) => tag.trim())
    .filter(Boolean)
    .filter((tag, index, array) => array.indexOf(tag) === index);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> },
) {
  const adminSession = await requireAdminApiSession(request);
  if (adminSession.response) {
    return adminSession.response;
  }

  const { leadId } = await params;
  const body = await request.json();
  const validationResult = leadUpdateSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        error: 'Invalid lead update input.',
        issues: validationResult.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const values = validationResult.data;
  const lead = await prisma.lead.update({
    where: { id: leadId },
    data: {
      ...values,
      notes: values.notes ?? null,
      tags: values.tags ? normalizeTags(values.tags) : undefined,
    },
  });

  return NextResponse.json({ lead });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> },
) {
  const adminSession = await requireAdminApiSession(request);
  if (adminSession.response) {
    return adminSession.response;
  }

  const { leadId } = await params;
  await prisma.lead.delete({ where: { id: leadId } });

  return NextResponse.json({ success: true });
}
