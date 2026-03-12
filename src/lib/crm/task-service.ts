import { prisma } from "@/lib/db";
import {
  sendTemplateEmail,
  buildVariablesFromLead,
} from "@/lib/crm/email-service";
import type { CrmTask, ContactSubmission } from "@prisma/client";

// ============================================================================
// SCHEDULE CALL REMINDERS
// ============================================================================

/**
 * Create CrmTasks for call reminders: 24h before, 1h before, 30min brief prep.
 * Filters out tasks that would be in the past.
 */
export async function scheduleCallReminders(
  leadId: string,
  callTime: Date,
): Promise<void> {
  const now = new Date();

  const tasks: { type: string; scheduledFor: Date }[] = [
    {
      type: "call_reminder_24h",
      scheduledFor: new Date(callTime.getTime() - 24 * 60 * 60 * 1000),
    },
    {
      type: "call_reminder_1h",
      scheduledFor: new Date(callTime.getTime() - 60 * 60 * 1000),
    },
    {
      type: "call_brief_prep",
      scheduledFor: new Date(callTime.getTime() - 30 * 60 * 1000),
    },
  ];

  // Filter out tasks that are already in the past
  const futureTasks = tasks.filter((t) => t.scheduledFor > now);

  if (futureTasks.length === 0) return;

  await prisma.crmTask.createMany({
    data: futureTasks.map((t) => ({
      leadId,
      type: t.type,
      status: "pending",
      scheduledFor: t.scheduledFor,
    })),
  });
}

// ============================================================================
// CANCEL LEAD TASKS
// ============================================================================

/**
 * Cancel all pending CrmTasks for a lead, optionally filtered by type.
 */
export async function cancelLeadTasks(
  leadId: string,
  types?: string[],
  reason?: string,
): Promise<number> {
  const where: Record<string, unknown> = {
    leadId,
    status: "pending",
  };

  if (types && types.length > 0) {
    where.type = { in: types };
  }

  const result = await prisma.crmTask.updateMany({
    where: where as Parameters<typeof prisma.crmTask.updateMany>[0]["where"],
    data: {
      status: "cancelled",
      cancelledReason: reason ?? "cancelled",
    },
  });

  return result.count;
}

// ============================================================================
// EXECUTE TASK
// ============================================================================

/**
 * Execute a single CrmTask based on its type.
 */
export async function executeTask(task: CrmTask): Promise<void> {
  // Fetch the lead for this task
  const lead = await prisma.contactSubmission.findUnique({
    where: { id: task.leadId },
  });

  if (!lead) {
    throw new Error(`Lead ${task.leadId} not found for task ${task.id}`);
  }

  switch (task.type) {
    case "call_reminder_24h":
      await executeCallReminder24h(lead);
      break;

    case "call_reminder_1h":
      await executeCallReminder1h(lead);
      break;

    case "call_brief_prep":
      await executeCallBriefPrep(lead);
      break;

    case "no_show_check":
      await executeNoShowCheck(lead);
      break;

    case "draft_proposal_reminder":
      await executeDraftProposalReminder(lead);
      break;

    default:
      console.warn(`[task-service] Unknown task type: ${task.type}`);
  }
}

// ============================================================================
// TASK EXECUTORS
// ============================================================================

async function executeCallReminder24h(
  lead: ContactSubmission,
): Promise<void> {
  // Find template by name
  const template = await prisma.emailTemplate.findUnique({
    where: { name: "rappel_appel_24h" },
  });

  if (!template) {
    console.error("[task-service] Template rappel_appel_24h not found");
    return;
  }

  const variables = buildVariablesFromLead(lead);

  await sendTemplateEmail({
    templateId: template.id,
    to: lead.email,
    leadId: lead.id,
    variables,
    activityType: "email_sent",
  });
}

async function executeCallReminder1h(
  lead: ContactSubmission,
): Promise<void> {
  // Find template by name
  const template = await prisma.emailTemplate.findUnique({
    where: { name: "rappel_appel" },
  });

  if (!template) {
    console.error("[task-service] Template rappel_appel not found");
    return;
  }

  const variables = buildVariablesFromLead(lead);

  await sendTemplateEmail({
    templateId: template.id,
    to: lead.email,
    leadId: lead.id,
    variables,
    activityType: "email_sent",
  });

  // Also notify admin
  await notifyAdmin(
    "call_reminder",
    `Appel dans 1h avec ${lead.name}`,
    `Appel prévu avec ${lead.name} (${lead.email}). Service : ${lead.service ?? "N/A"}, Score : ${lead.score}.`,
    `/admin/crm/leads/${lead.id}`,
  );
}

async function executeCallBriefPrep(
  lead: ContactSubmission,
): Promise<void> {
  // No email to lead — just admin notification with brief
  const brief = [
    `Appel dans 30 min avec ${lead.name}`,
    `Service : ${lead.service ?? "N/A"}`,
    `Budget : ${lead.budget ?? "N/A"}`,
    `Score : ${lead.score}/100`,
    `Entreprise : ${lead.company ?? "N/A"}`,
    lead.message ? `Message : ${lead.message.slice(0, 200)}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  await notifyAdmin(
    "call_brief",
    `Brief : appel dans 30 min avec ${lead.name}`,
    brief,
    `/admin/crm/leads/${lead.id}`,
  );
}

async function executeNoShowCheck(
  lead: ContactSubmission,
): Promise<void> {
  // If lead is still CALL_BOOKED without callResult → notify admin
  if (lead.stage === "CALL_BOOKED" && !lead.callResult) {
    await notifyAdmin(
      "no_show_check",
      `No-show potentiel : ${lead.name}`,
      `L'appel avec ${lead.name} (${lead.email}) semble ne pas avoir eu lieu. Vérifiez et marquez comme effectué ou no-show.`,
      `/admin/crm/leads/${lead.id}`,
    );
  }
}

async function executeDraftProposalReminder(
  lead: ContactSubmission,
): Promise<void> {
  await notifyAdmin(
    "proposal_reminder",
    `Rappel : devis à préparer pour ${lead.name}`,
    `La deadline pour le devis de ${lead.name} (${lead.email}) approche. Montant estimé : ${lead.callEstimatedAmountCents ? `${(lead.callEstimatedAmountCents / 100).toFixed(0)} €` : "N/A"}.`,
    `/admin/crm/leads/${lead.id}`,
  );
}

// ============================================================================
// ADMIN NOTIFICATION HELPER
// ============================================================================

async function notifyAdmin(
  type: string,
  title: string,
  message: string,
  link?: string,
): Promise<void> {
  try {
    // Get first active admin
    const admin = await prisma.adminUser.findFirst({
      where: { active: true },
      select: { id: true },
    });

    await prisma.notification.create({
      data: {
        adminId: admin?.id ?? null,
        type,
        title,
        message,
        link: link ?? null,
      },
    });
  } catch (err) {
    console.error("[task-service] notifyAdmin error:", err);
  }
}
