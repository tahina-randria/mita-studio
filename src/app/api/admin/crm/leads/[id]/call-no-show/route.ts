import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/crm/auth-guard";
import { callNoShowSchema } from "@/lib/crm/validations";
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
    const parsed = callNoShowSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides." },
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

    const newNoShowCount = lead.noShowCount + 1;

    // 1. Update lead
    const updatedLead = await prisma.contactSubmission.update({
      where: { id },
      data: {
        isNoShow: true,
        noShowCount: newNoShowCount,
        callResult: "no_show",
        callCompletedAt: new Date(),
        // After 2 no-shows, move to LOST
        stage: newNoShowCount >= 2 ? "LOST" : "CALL_BOOKED",
        lostReason: newNoShowCount >= 2 ? "no_response" : undefined,
        lastContactedAt: new Date(),
      },
    });

    // 2. Cancel pending call tasks
    await cancelLeadTasks(id, undefined, "no_show");

    // 3. Create no-show activity
    await prisma.leadActivity.create({
      data: {
        leadId: id,
        type: "no_show",
        title: `No-show enregistré (total: ${newNoShowCount})`,
        details: {
          noShowCount: newNoShowCount,
          callScheduledAt: lead.callScheduledAt?.toISOString() ?? null,
          autoLost: newNoShowCount >= 2,
        } as unknown as Prisma.InputJsonValue,
        adminId: admin.id,
      },
    });

    // Stage change activity if moved to LOST
    if (newNoShowCount >= 2) {
      await prisma.leadActivity.create({
        data: {
          leadId: id,
          type: "stage_change",
          title: `Stage changé : CALL_BOOKED → LOST (2 no-shows)`,
          details: {
            from: "CALL_BOOKED",
            to: "LOST",
            reason: "2_no_shows",
          },
          adminId: admin.id,
        },
      });
    }

    // 4. Audit log
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: "call_no_show",
        entity: "contact_submission",
        entityId: id,
        details: {
          noShowCount: newNoShowCount,
          sendRescheduleEmail: parsed.data.sendRescheduleEmail,
        } as unknown as Prisma.InputJsonValue,
      },
    });

    // 5. Send no-show email (T08)
    if (parsed.data.sendRescheduleEmail !== false) {
      const template = await prisma.emailTemplate.findUnique({
        where: { name: "no_show" },
      });

      if (template) {
        const variables = buildVariablesFromLead(updatedLead);
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

    // 6. Notify admin
    const adminUser = await prisma.adminUser.findFirst({
      where: { active: true },
      select: { id: true },
    });

    await prisma.notification.create({
      data: {
        adminId: adminUser?.id ?? null,
        type: "no_show",
        title: `No-show : ${lead.name} (${newNoShowCount}x)`,
        message: newNoShowCount >= 2
          ? `${lead.name} a fait ${newNoShowCount} no-shows. Lead marqué LOST.`
          : `${lead.name} n'a pas honoré son appel. Email de reprogrammation ${parsed.data.sendRescheduleEmail !== false ? "envoyé" : "non envoyé"}.`,
        link: `/admin/crm/leads/${id}`,
      },
    });

    return NextResponse.json({
      success: true,
      lead: updatedLead,
      autoLost: newNoShowCount >= 2,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }
    console.error("[call-no-show] POST error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 },
    );
  }
}
