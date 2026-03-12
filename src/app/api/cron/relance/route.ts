import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendTemplateEmail, buildVariablesFromLead } from "@/lib/crm/email-service";

// Template names for each relance step
const RELANCE_TEMPLATES = [
  "relance_j3", // 0 previous relances → send T03
  "relance_j5", // 1 previous relance  → send T04
  "relance_j7", // 2 previous relances → send T05
] as const;

/**
 * GET /api/cron/relance
 * Cron job: auto-send follow-up emails to eligible leads.
 * Protected by CRON_SECRET header.
 */
export async function GET(request: Request) {
  // ── Auth: verify CRON_SECRET ──
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  let sent = 0;
  let skipped = 0;
  let errors = 0;

  try {
    // ── Find eligible leads ──
    // Criteria: stage = NEW, nextFollowUpAt <= now
    const eligibleLeads = await prisma.contactSubmission.findMany({
      where: {
        stage: "NEW",
        nextFollowUpAt: { lte: now },
      },
    });

    for (const lead of eligibleLeads) {
      try {
        // Check if we sent any email in the last 24h
        const recentEmail = await prisma.emailLog.findFirst({
          where: {
            leadId: lead.id,
            status: "sent",
            sentAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
          },
        });

        if (recentEmail) {
          skipped++;
          continue;
        }

        // Count previous auto-relances
        const relanceCount = await prisma.leadActivity.count({
          where: {
            leadId: lead.id,
            type: "auto_relance",
          },
        });

        // Determine which template to use
        if (relanceCount >= RELANCE_TEMPLATES.length) {
          // All relances exhausted — stop following up
          await prisma.contactSubmission.update({
            where: { id: lead.id },
            data: { nextFollowUpAt: null },
          });
          skipped++;
          continue;
        }

        const templateName = RELANCE_TEMPLATES[relanceCount];

        // Find template in DB
        const template = await prisma.emailTemplate.findUnique({
          where: { name: templateName },
        });

        if (!template || !template.active) {
          skipped++;
          continue;
        }

        // Build variables
        const variables = buildVariablesFromLead(lead);

        // Send the email
        const result = await sendTemplateEmail({
          templateId: template.id,
          to: lead.email,
          leadId: lead.id,
          variables,
          adminId: null,
          activityType: "auto_relance",
        });

        if (result.success) {
          // Schedule next follow-up in 2 days (or clear if this was the last one)
          const isLast = relanceCount + 1 >= RELANCE_TEMPLATES.length;
          await prisma.contactSubmission.update({
            where: { id: lead.id },
            data: {
              nextFollowUpAt: isLast
                ? null
                : new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
            },
          });
          sent++;
        } else {
          errors++;
        }
      } catch (err) {
        console.error(`[cron/relance] Error for lead ${lead.id}:`, err);
        errors++;
      }
    }

    // ── Update ScheduledJob tracking ──
    await prisma.scheduledJob.upsert({
      where: { name: "auto_relance" },
      update: {
        lastRunAt: now,
        status: "idle",
      },
      create: {
        name: "auto_relance",
        description: "Auto-relance leads J+3/J+5/J+7",
        cronExpr: "0 * * * *",
        enabled: true,
        lastRunAt: now,
        status: "idle",
      },
    });

    return NextResponse.json({
      success: true,
      sent,
      skipped,
      errors,
      total: eligibleLeads.length,
    });
  } catch (err) {
    console.error("[cron/relance] Fatal error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
