import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/crm/auth-guard";
import { callCompleteSchema } from "@/lib/crm/validations";
import {
  sendTemplateEmail,
  buildVariablesFromLead,
} from "@/lib/crm/email-service";
import { cancelLeadTasks } from "@/lib/crm/task-service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAuth();
    const { id } = await params;

    const body = await request.json();
    const parsed = callCompleteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides.", details: parsed.error.issues },
        { status: 400 },
      );
    }

    // Verify lead exists and is in CALL_BOOKED stage
    const lead = await prisma.contactSubmission.findUnique({
      where: { id },
    });

    if (!lead) {
      return NextResponse.json(
        { error: "Lead introuvable." },
        { status: 404 },
      );
    }

    if (lead.stage !== "CALL_BOOKED") {
      return NextResponse.json(
        { error: "Ce lead n'est pas au stade CALL_BOOKED." },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // 1. Update lead with call results
    const updateData: Record<string, unknown> = {
      stage: "CALL_DONE",
      callCompletedAt: new Date(),
      callResult: data.callResult,
      callNotes: data.callNotes ?? null,
      callDurationMinutes: data.callDurationMinutes ?? null,
      callBudgetDiscussed: data.callBudgetDiscussed ?? null,
      callUrgencyDiscussed: data.callUrgencyDiscussed ?? null,
      callIsDecisionMaker: data.callIsDecisionMaker ?? null,
      callNextAction: data.callNextAction ?? null,
      isNoShow: false,
      lastContactedAt: new Date(),
    };

    if (data.callFeaturesNeeded) {
      updateData.callFeaturesNeeded = data.callFeaturesNeeded;
    }

    if (data.callProposalDeadline) {
      updateData.callProposalDeadline = new Date(data.callProposalDeadline);
    }

    if (data.callEstimatedAmountCents !== undefined) {
      updateData.callEstimatedAmountCents = data.callEstimatedAmountCents;
    }

    const updatedLead = await prisma.contactSubmission.update({
      where: { id },
      data: updateData,
    });

    // 2. Cancel pending call reminder tasks
    await cancelLeadTasks(id, undefined, "call_completed");

    // 3. Create activity
    await prisma.leadActivity.create({
      data: {
        leadId: id,
        type: "call_done",
        title: `Appel terminé — ${data.callResult}`,
        details: {
          callResult: data.callResult,
          callDurationMinutes: data.callDurationMinutes,
          callNotes: data.callNotes,
          callBudgetDiscussed: data.callBudgetDiscussed,
          callIsDecisionMaker: data.callIsDecisionMaker,
          callNextAction: data.callNextAction,
          callEstimatedAmountCents: data.callEstimatedAmountCents,
        } as unknown as Prisma.InputJsonValue,
        adminId: admin.id,
      },
    });

    // 4. Stage change activity
    await prisma.leadActivity.create({
      data: {
        leadId: id,
        type: "stage_change",
        title: `Stage changé : CALL_BOOKED → CALL_DONE`,
        details: { from: "CALL_BOOKED", to: "CALL_DONE" },
        adminId: admin.id,
      },
    });

    // 5. Audit log
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: "call_complete",
        entity: "contact_submission",
        entityId: id,
        details: data as unknown as Prisma.InputJsonValue,
      },
    });

    // 6. Send recap email if requested
    if (data.sendRecapEmail && data.recapContent) {
      const template = await prisma.emailTemplate.findUnique({
        where: { name: "recap_appel" },
      });

      if (template) {
        const variables = buildVariablesFromLead(updatedLead);
        variables.recap_appel = data.recapContent;
        variables.admin_name = admin.name ?? "Tahina";

        await sendTemplateEmail({
          templateId: template.id,
          to: updatedLead.email,
          leadId: id,
          variables,
          adminId: admin.id,
          activityType: "email_sent",
        });
      }
    }

    // 7. Send merci_post_appel email
    const merciTemplate = await prisma.emailTemplate.findUnique({
      where: { name: "merci_post_appel" },
    });

    if (merciTemplate) {
      const variables = buildVariablesFromLead(updatedLead);
      variables.admin_name = admin.name ?? "Tahina";

      await sendTemplateEmail({
        templateId: merciTemplate.id,
        to: updatedLead.email,
        leadId: id,
        variables,
        adminId: admin.id,
        activityType: "email_sent",
      });
    }

    // 8. Schedule proposal reminder if deadline set
    if (data.callProposalDeadline) {
      const deadline = new Date(data.callProposalDeadline);
      const reminderDate = new Date(
        deadline.getTime() - 24 * 60 * 60 * 1000,
      );

      if (reminderDate > new Date()) {
        await prisma.crmTask.create({
          data: {
            leadId: id,
            type: "draft_proposal_reminder",
            status: "pending",
            scheduledFor: reminderDate,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      lead: updatedLead,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }
    console.error("[call-complete] POST error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 },
    );
  }
}
