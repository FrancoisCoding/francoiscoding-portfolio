import { NextRequest, NextResponse } from 'next/server';

import { requireAdminApiSession } from '@/lib/auth/admin-route';
import { prisma } from '@/lib/prisma';
import { draftUpdateSchema } from '@/lib/validation/admin-draft';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ draftId: string }> },
) {
  const adminSession = await requireAdminApiSession(request);
  if (adminSession.response) {
    return adminSession.response;
  }
  if (!adminSession.session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { draftId } = await params;
  const body = await request.json();
  const validationResult = draftUpdateSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        error: 'Invalid draft update values.',
        issues: validationResult.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const values = validationResult.data;
  const isApproveAction = values.status === 'APPROVED';
  const updatedDraft = await prisma.draft.update({
    where: { id: draftId },
    data: {
      ...values,
      approvedAt: isApproveAction ? new Date() : undefined,
    },
  });

  if (isApproveAction) {
    await prisma.auditLog.create({
      data: {
        actorEmail: adminSession.session.userEmail,
        action: 'approve',
        entityType: 'Draft',
        entityId: updatedDraft.id,
        summary: `Approved draft ${updatedDraft.id}`,
      },
    });
  }

  return NextResponse.json({ draft: updatedDraft });
}
