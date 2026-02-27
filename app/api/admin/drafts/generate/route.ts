import { NextRequest, NextResponse } from 'next/server';

import { requireAdminApiSession } from '@/lib/auth/admin-route';
import { generateDraftWithOptionalAi } from '@/lib/admin/template-renderer';
import { prisma } from '@/lib/prisma';
import { draftGenerateSchema } from '@/lib/validation/admin-draft';

export async function POST(request: NextRequest) {
  const adminSession = await requireAdminApiSession(request);
  if (adminSession.response) {
    return adminSession.response;
  }
  if (!adminSession.session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validationResult = draftGenerateSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        error: 'Invalid generation request.',
        issues: validationResult.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { leadId, templateId, highlight } = validationResult.data;
  const [lead, template] = await Promise.all([
    prisma.lead.findUnique({ where: { id: leadId } }),
    prisma.template.findUnique({ where: { id: templateId } }),
  ]);

  if (!lead || !template) {
    return NextResponse.json(
      { error: 'Lead or template not found.' },
      { status: 404 },
    );
  }

  const generatedDraft = await generateDraftWithOptionalAi({
    lead,
    template,
    highlight,
  });

  const draft = await prisma.draft.create({
    data: {
      leadId: lead.id,
      templateId: template.id,
      subject: generatedDraft.subject,
      body: generatedDraft.body,
      status: 'QUEUED',
    },
  });

  await prisma.auditLog.create({
    data: {
      actorEmail: adminSession.session.userEmail,
      action: 'generate',
      entityType: 'Draft',
      entityId: draft.id,
      summary: `Generated draft for ${lead.personName} at ${lead.company}`,
    },
  });

  return NextResponse.json({ draft }, { status: 201 });
}
