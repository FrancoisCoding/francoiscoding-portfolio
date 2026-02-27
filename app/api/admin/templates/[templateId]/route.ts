import { NextRequest, NextResponse } from 'next/server';

import { requireAdminApiSession } from '@/lib/auth/admin-route';
import { prisma } from '@/lib/prisma';
import { templateUpdateSchema } from '@/lib/validation/admin-template';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> },
) {
  const adminSession = await requireAdminApiSession(request);
  if (adminSession.response) {
    return adminSession.response;
  }

  const { templateId } = await params;
  const body = await request.json();
  const validationResult = templateUpdateSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        error: 'Invalid template update values.',
        issues: validationResult.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const template = await prisma.template.update({
    where: { id: templateId },
    data: validationResult.data,
  });

  return NextResponse.json({ template });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> },
) {
  const adminSession = await requireAdminApiSession(request);
  if (adminSession.response) {
    return adminSession.response;
  }

  const { templateId } = await params;
  await prisma.template.delete({ where: { id: templateId } });

  return NextResponse.json({ success: true });
}
