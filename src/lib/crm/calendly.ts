import { prisma } from "@/lib/db";
import {
  sendTemplateEmail,
  buildVariablesFromLead,
} from "@/lib/crm/email-service";
import {
  scheduleCallReminders,
  cancelLeadTasks,
} from "@/lib/crm/task-service";
import crypto from "crypto";

// ============================================================================
// CALENDLY LINK BUILDER
// ============================================================================

/**
 * Build a Calendly link pre-filled with lead info.
 */
export function getCalendlyLink(lead: {
  name: string;
  email: string;
}): string {
  const base =
    process.env.NEXT_PUBLIC_CALENDLY_URL ??
    "https://calendly.com/tahina-mitastudio/15min";
  const url = new URL(base);
  url.searchParams.set("name", lead.name);
  url.searchParams.set("email", lead.email);
  return url.toString();
}

// ============================================================================
// SIGNATURE VERIFICATION (optional)
// ============================================================================

/**
 * Verify Calendly webhook signature (HMAC-SHA256).
 * Returns true if valid or if no secret configured (optional).
 */
export function verifyCalendlySignature(
  payload: string,
  signature: string | null,
  key: string | null,
): boolean {
  if (!key || !signature) return true; // Optional: skip if no secret configured

  try {
    // Calendly sends signature in format: v1,<timestamp>,<signature>
    const parts = signature.split(",");
    if (parts.length < 3) return false;

    const timestamp = parts[0];
    const sig = parts[2];
    if (!timestamp || !sig) return false;

    const signedPayload = `${timestamp}.${payload}`;
    const expectedSig = crypto
      .createHmac("sha256", key)
      .update(signedPayload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(sig, "hex"),
      Buffer.from(expectedSig, "hex"),
    );
  } catch {
    return false;
  }
}

// ============================================================================
// PROCESS INVITEE CREATED (new booking)
// ============================================================================

interface CalendlyInviteePayload {
  event: string;
  payload: {
    email?: string;
    name?: string;
    event?: string; // event URI
    new_invitee?: string;
    old_invitee?: string;
    cancel_url?: string;
    reschedule_url?: string;
    scheduled_event?: {
      uri?: string;
      start_time?: string;
      end_time?: string;
      location?: {
        join_url?: string;
        type?: string;
      };
    };
  };
}

export async function processInviteeCreated(
  data: CalendlyInviteePayload,
): Promise<{ success: boolean; leadId?: string; error?: string }> {
  try {
    const { payload } = data;
    const email = payload.email;
    const name = payload.name ?? "Inconnu";
    const eventUri = payload.scheduled_event?.uri ?? payload.event ?? null;
    const startTime = payload.scheduled_event?.start_time;
    const videoLink =
      payload.scheduled_event?.location?.join_url ?? null;
    const rescheduleUrl = payload.reschedule_url ?? null;
    const cancelUrl = payload.cancel_url ?? null;

    if (!email) {
      return { success: false, error: "No email in payload" };
    }

    // 1. Match lead by email (or create new)
    let lead = await prisma.contactSubmission.findFirst({
      where: { email: email.toLowerCase() },
      orderBy: { createdAt: "desc" },
    });

    if (!lead) {
      // Create a new lead from Calendly booking
      lead = await prisma.contactSubmission.create({
        data: {
          name,
          email: email.toLowerCase(),
          message: "Réservation via Calendly",
          source: "calendly",
          stage: "CALL_BOOKED",
          score: 40, // Default score for Calendly bookings
          callScheduledAt: startTime ? new Date(startTime) : null,
          callVideoLink: videoLink,
          callCalendlyEventUri: eventUri,
          callRescheduleUrl: rescheduleUrl,
          callCancelUrl: cancelUrl,
        },
      });
    } else {
      // 2. Update existing lead
      await prisma.contactSubmission.update({
        where: { id: lead.id },
        data: {
          stage: "CALL_BOOKED",
          callScheduledAt: startTime ? new Date(startTime) : null,
          callVideoLink: videoLink,
          callCalendlyEventUri: eventUri,
          callRescheduleUrl: rescheduleUrl,
          callCancelUrl: cancelUrl,
          nextFollowUpAt: null, // Stop auto-relances
        },
      });

      // Refresh lead data
      lead = await prisma.contactSubmission.findUnique({
        where: { id: lead.id },
      });

      if (!lead) {
        return { success: false, error: "Lead lost after update" };
      }
    }

    // 3. Cancel pending relance tasks
    await cancelLeadTasks(lead.id, undefined, "call_booked");

    // 4. Schedule call reminders
    if (lead.callScheduledAt) {
      await scheduleCallReminders(lead.id, lead.callScheduledAt);
    }

    // 5. Activity log
    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        type: "call_scheduled",
        title: "Appel planifié via Calendly",
        details: {
          callScheduledAt: lead.callScheduledAt?.toISOString() ?? null,
          videoLink: videoLink,
          source: "calendly_webhook",
        },
      },
    });

    // 6. Send confirmation email (T06)
    const template = await prisma.emailTemplate.findUnique({
      where: { name: "confirmation_appel" },
    });

    if (template) {
      const variables = buildVariablesFromLead(lead);
      await sendTemplateEmail({
        templateId: template.id,
        to: lead.email,
        leadId: lead.id,
        variables,
        activityType: "email_sent",
      });
    }

    // 7. Notify admin
    const admin = await prisma.adminUser.findFirst({
      where: { active: true },
      select: { id: true },
    });

    await prisma.notification.create({
      data: {
        adminId: admin?.id ?? null,
        type: "call_scheduled",
        title: `Appel planifié : ${lead.name}`,
        message: `${lead.name} (${lead.email}) a réservé un appel${lead.callScheduledAt ? ` le ${lead.callScheduledAt.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Paris" })} à ${lead.callScheduledAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" })}` : ""}.`,
        link: `/admin/crm/leads/${lead.id}`,
      },
    });

    return { success: true, leadId: lead.id };
  } catch (err) {
    console.error("[calendly] processInviteeCreated error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

// ============================================================================
// PROCESS INVITEE CANCELED
// ============================================================================

export async function processInviteeCanceled(
  data: CalendlyInviteePayload,
): Promise<{ success: boolean; leadId?: string; error?: string }> {
  try {
    const { payload } = data;
    const email = payload.email;
    const eventUri = payload.scheduled_event?.uri ?? payload.event ?? null;

    // 1. Match lead by Calendly event URI or email
    let lead = eventUri
      ? await prisma.contactSubmission.findFirst({
          where: { callCalendlyEventUri: eventUri },
        })
      : null;

    if (!lead && email) {
      lead = await prisma.contactSubmission.findFirst({
        where: {
          email: email.toLowerCase(),
          stage: "CALL_BOOKED",
        },
        orderBy: { createdAt: "desc" },
      });
    }

    if (!lead) {
      return { success: false, error: "No matching lead found" };
    }

    // 2. Cancel CrmTasks
    await cancelLeadTasks(lead.id, undefined, "call_cancelled");

    // 3. Revert stage and clear call fields, set up for re-engagement
    const nextFollowUp = new Date();
    nextFollowUp.setDate(nextFollowUp.getDate() + 2);

    await prisma.contactSubmission.update({
      where: { id: lead.id },
      data: {
        stage: "CONTACTED",
        callScheduledAt: null,
        callVideoLink: null,
        callCalendlyEventUri: null,
        callRescheduleUrl: null,
        callCancelUrl: null,
        nextFollowUpAt: nextFollowUp,
      },
    });

    // 4. Activity log
    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        type: "stage_change",
        title: "Appel annulé via Calendly",
        details: {
          from: "CALL_BOOKED",
          to: "CONTACTED",
          source: "calendly_webhook",
          previousCallTime: lead.callScheduledAt?.toISOString() ?? null,
        },
      },
    });

    // 5. Notify admin
    const admin = await prisma.adminUser.findFirst({
      where: { active: true },
      select: { id: true },
    });

    await prisma.notification.create({
      data: {
        adminId: admin?.id ?? null,
        type: "call_cancelled",
        title: `Appel annulé : ${lead.name}`,
        message: `${lead.name} (${lead.email}) a annulé son appel. Relance automatique programmée dans 2 jours.`,
        link: `/admin/crm/leads/${lead.id}`,
      },
    });

    return { success: true, leadId: lead.id };
  } catch (err) {
    console.error("[calendly] processInviteeCanceled error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
