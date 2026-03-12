import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getLeadById } from "@/lib/crm/queries";
import { updateLeadSchema } from "@/lib/crm/validations";
import { requireAuth } from "@/lib/crm/auth-guard";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();

    const { id } = await params;
    const lead = await getLeadById(id);

    if (!lead) {
      return NextResponse.json(
        { error: "Lead introuvable." },
        { status: 404 }
      );
    }

    return NextResponse.json(lead);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAuth();
    const { id } = await params;

    const body = await request.json();
    const parsed = updateLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides." },
        { status: 400 }
      );
    }

    // Check lead exists
    const existing = await prisma.contactSubmission.findUnique({
      where: { id },
      select: { id: true, stage: true, noShowCount: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Lead introuvable." },
        { status: 404 }
      );
    }

    const data: Record<string, unknown> = {};
    const activities: Array<{
      type: string;
      title: string;
      details?: Prisma.InputJsonValue;
    }> = [];

    // Stage change
    if (parsed.data.stage && parsed.data.stage !== existing.stage) {
      data.stage = parsed.data.stage;

      activities.push({
        type: "stage_change",
        title: `Stage changé : ${existing.stage} → ${parsed.data.stage}`,
        details: { from: existing.stage, to: parsed.data.stage },
      });

      // Auto-set convertedAt when stage is WON
      if (parsed.data.stage === "WON") {
        data.convertedAt = new Date();
      }
    }

    // Deal value
    if (parsed.data.dealValue !== undefined) {
      data.dealValue = parsed.data.dealValue;
    }

    // Lost reason
    if (parsed.data.lostReason !== undefined) {
      data.lostReason = parsed.data.lostReason;
    }

    // Next follow-up
    if (parsed.data.nextFollowUpAt !== undefined) {
      data.nextFollowUpAt = parsed.data.nextFollowUpAt
        ? new Date(parsed.data.nextFollowUpAt)
        : null;
    }

    // Last contacted
    if (parsed.data.lastContactedAt !== undefined) {
      data.lastContactedAt = parsed.data.lastContactedAt
        ? new Date(parsed.data.lastContactedAt)
        : null;
    }

    // No-show handling
    if (parsed.data.isNoShow === true) {
      data.isNoShow = true;
      data.noShowCount = existing.noShowCount + 1;
      activities.push({
        type: "no_show",
        title: `No-show enregistré (total: ${existing.noShowCount + 1})`,
      });
    } else if (parsed.data.isNoShow === false) {
      data.isNoShow = false;
    }

    // Update lead
    const updated = await prisma.contactSubmission.update({
      where: { id },
      data,
    });

    // Create activities
    if (activities.length > 0) {
      await prisma.leadActivity.createMany({
        data: activities.map((a) => ({
          leadId: id,
          type: a.type,
          title: a.title,
          details: a.details ?? undefined,
          adminId: admin.id,
        })),
      });
    }

    // Log audit
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: "update_lead",
        entity: "contact_submission",
        entityId: id,
        details: parsed.data as unknown as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }
    console.error("[leads/[id]] PATCH error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}
