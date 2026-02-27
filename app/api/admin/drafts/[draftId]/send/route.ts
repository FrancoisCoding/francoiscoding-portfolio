import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

import { requireAdminApiSession } from '@/lib/auth/admin-route';
import { enforceSendThrottle } from '@/lib/admin/send-throttle';
import { prisma } from '@/lib/prisma';

const resendClient = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const unsubscribeFooter =
  '\n\n---\nIf you prefer not to receive future outreach regarding this opportunity, reply with "unsubscribe".';

export async function POST(
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

  if (!resendClient) {
    return NextResponse.json(
      { error: 'RESEND_API_KEY is not configured.' },
      { status: 500 },
    );
  }

  const { draftId } = await params;
  const draft = await prisma.draft.findUnique({
    where: { id: draftId },
    include: {
      lead: true,
      template: {
        select: { name: true },
      },
    },
  });

  if (!draft) {
    return NextResponse.json({ error: 'Draft not found.' }, { status: 404 });
  }

  if (draft.status !== 'APPROVED') {
    return NextResponse.json(
      { error: 'Only approved drafts can be sent.' },
      { status: 400 },
    );
  }

  const throttleResult = enforceSendThrottle();
  if (!throttleResult.allowed) {
    return NextResponse.json(
      { error: throttleResult.message },
      { status: 429 },
    );
  }

  await resendClient.emails.send({
    from: 'Isaiah Francois <onboarding@resend.dev>',
    to: [draft.lead.email],
    subject: draft.subject,
    text: `${draft.body}${unsubscribeFooter}`,
  });

  const sentDraft = await prisma.draft.update({
    where: { id: draft.id },
    data: {
      status: 'SENT',
      sentAt: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      actorEmail: adminSession.session.userEmail,
      action: 'send',
      entityType: 'Draft',
      entityId: sentDraft.id,
      summary: `Sent draft to ${draft.lead.email} (${draft.template?.name ?? 'manual'})`,
    },
  });

  return NextResponse.json({ success: true, draft: sentDraft });
}
