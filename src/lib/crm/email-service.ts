import { prisma } from "@/lib/db";

// ============================================================================
// TYPES
// ============================================================================

export interface EmailVariables {
  prenom: string;
  nom: string;
  email: string;
  service: string;
  budget: string;
  entreprise: string;
  telephone: string;
  message: string;
  // Custom variables for specific templates
  date_appel?: string;
  heure_appel?: string;
  lien_calendly?: string;
  lien_devis?: string;
  recap_appel?: string;
  admin_name?: string;
  // Call variables (Week 3)
  lien_visio?: string;
  lien_reprogrammer?: string;
  lien_annuler?: string;
}

export interface SendEmailOptions {
  templateId: string;
  to: string;
  leadId: string;
  variables: Partial<EmailVariables>;
  adminId?: string | null;
  activityType?: string; // defaults to "email_sent"
  customSubject?: string;
  customHtml?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  emailLogId?: string;
  error?: string;
}

// ============================================================================
// EMAIL LAYOUT (responsive, inline styles, table-based for Outlook)
// ============================================================================

export function wrapInEmailLayout(bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mita Studio</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid #e4e4e7;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="display:inline-block;width:36px;height:36px;background-color:#0a0a0a;border-radius:8px;text-align:center;line-height:36px;color:#ffffff;font-weight:700;font-size:16px;vertical-align:middle;">M</div>
                    <span style="margin-left:10px;font-size:18px;font-weight:700;color:#0a0a0a;vertical-align:middle;">Mita Studio</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              ${bodyContent}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #e4e4e7;background-color:#fafafa;">
              <p style="margin:0;font-size:13px;color:#71717a;line-height:1.6;">
                Tahina Ranaivo — Mita Studio<br>
                <a href="mailto:tahina@mita-studio.com" style="color:#3b82f6;text-decoration:none;">tahina@mita-studio.com</a>
                &nbsp;|&nbsp;
                <a href="https://mita-studio.com" style="color:#3b82f6;text-decoration:none;">mita-studio.com</a>
              </p>
            </td>
          </tr>
        </table>
        <!-- Unsubscribe -->
        <p style="margin:16px 0 0;font-size:11px;color:#a1a1aa;text-align:center;">
          Cet email a été envoyé par Mita Studio. Statut CAPE — TVA 20 % applicable.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ============================================================================
// TEMPLATE RENDERING
// ============================================================================

/**
 * Replace {{variable}} placeholders in a template string with provided values.
 */
export function renderTemplate(
  template: string,
  variables: Record<string, string>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] ?? "");
}

/**
 * Build email variables from a ContactSubmission lead.
 */
export function buildVariablesFromLead(lead: {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service?: string | null;
  budget?: string | null;
  message: string;
  callScheduledAt?: Date | null;
  callVideoLink?: string | null;
  callRescheduleUrl?: string | null;
  callCancelUrl?: string | null;
}): EmailVariables {
  const nameParts = lead.name.trim().split(/\s+/);
  const prenom = nameParts[0] ?? "";
  const nom = lead.name;

  const vars: EmailVariables = {
    prenom,
    nom,
    email: lead.email,
    service: lead.service ?? "Non renseigné",
    budget: lead.budget ?? "Non renseigné",
    entreprise: lead.company ?? "Non renseigné",
    telephone: lead.phone ?? "Non renseigné",
    message: lead.message,
    lien_calendly: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "",
  };

  // Call-specific variables
  if (lead.callScheduledAt) {
    const dt = new Date(lead.callScheduledAt);
    vars.date_appel = dt.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Europe/Paris",
    });
    vars.heure_appel = dt.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Paris",
    });
  }

  if (lead.callVideoLink) {
    vars.lien_visio = lead.callVideoLink;
  }
  if (lead.callRescheduleUrl) {
    vars.lien_reprogrammer = lead.callRescheduleUrl;
  }
  if (lead.callCancelUrl) {
    vars.lien_annuler = lead.callCancelUrl;
  }

  return vars;
}

// ============================================================================
// TRACKING PIXEL
// ============================================================================

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ??
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";

/**
 * Inject a 1x1 tracking pixel before </body>.
 */
export function injectTrackingPixel(
  html: string,
  openToken: string,
): string {
  const trackingUrl = `${BASE_URL}/api/track/open/${openToken}`;
  const pixel = `<img src="${trackingUrl}" alt="" width="1" height="1" style="display:block;width:1px;height:1px;border:0;" />`;

  if (html.includes("</body>")) {
    return html.replace("</body>", `${pixel}</body>`);
  }
  // Fallback: append to end
  return html + pixel;
}

// ============================================================================
// MAIN SEND FUNCTION
// ============================================================================

/**
 * Send a templated email, log it, create activity, and track opens.
 */
export async function sendTemplateEmail(
  options: SendEmailOptions,
): Promise<SendEmailResult> {
  const {
    templateId,
    to,
    leadId,
    variables,
    adminId = null,
    activityType = "email_sent",
    customSubject,
    customHtml,
  } = options;

  try {
    // 1. Fetch template
    const template = await prisma.emailTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return { success: false, error: "Template not found" };
    }

    // 2. Build string variables map
    const varsMap: Record<string, string> = {};
    for (const [key, value] of Object.entries(variables)) {
      if (value !== undefined && value !== null) {
        varsMap[key] = String(value);
      }
    }

    // 3. Render subject and body
    const renderedSubject = customSubject
      ? renderTemplate(customSubject, varsMap)
      : renderTemplate(template.subject, varsMap);

    const renderedBody = customHtml
      ? customHtml
      : wrapInEmailLayout(renderTemplate(template.htmlBody, varsMap));

    // 4. Create EmailLog first to get openToken
    const fromAddress =
      process.env.RESEND_FROM_EMAIL ?? "Mita Studio <tahina@mita-studio.com>";

    const emailLog = await prisma.emailLog.create({
      data: {
        templateId: template.id,
        to,
        from: fromAddress,
        subject: renderedSubject,
        status: "sending",
        leadId,
        metadata: { variables: varsMap, adminId },
      },
    });

    // 5. Inject tracking pixel
    const finalHtml = injectTrackingPixel(renderedBody, emailLog.openToken!);

    // 6. Send via Resend
    if (!process.env.RESEND_API_KEY) {
      await prisma.emailLog.update({
        where: { id: emailLog.id },
        data: { status: "failed", error: "RESEND_API_KEY not configured" },
      });
      return {
        success: false,
        emailLogId: emailLog.id,
        error: "RESEND_API_KEY not configured",
      };
    }

    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const result = await resend.emails.send({
      from: fromAddress,
      to: [to],
      subject: renderedSubject,
      html: finalHtml,
      text: template.textBody
        ? renderTemplate(template.textBody, varsMap)
        : undefined,
    });

    // 7. Update EmailLog
    if (result.error) {
      await prisma.emailLog.update({
        where: { id: emailLog.id },
        data: {
          status: "failed",
          error: JSON.stringify(result.error),
        },
      });
      return {
        success: false,
        emailLogId: emailLog.id,
        error: result.error.message,
      };
    }

    await prisma.emailLog.update({
      where: { id: emailLog.id },
      data: {
        status: "sent",
        resendId: result.data?.id ?? null,
      },
    });

    // 8. Create LeadActivity
    await prisma.leadActivity.create({
      data: {
        leadId,
        type: activityType,
        title:
          activityType === "auto_relance"
            ? `Relance automatique envoyée`
            : `Email envoyé : ${renderedSubject}`,
        details: {
          emailLogId: emailLog.id,
          templateName: template.name,
          to,
          subject: renderedSubject,
        },
        adminId,
      },
    });

    // 9. Update lead lastContactedAt
    await prisma.contactSubmission.update({
      where: { id: leadId },
      data: { lastContactedAt: new Date() },
    });

    return {
      success: true,
      messageId: result.data?.id ?? undefined,
      emailLogId: emailLog.id,
    };
  } catch (err) {
    console.error("[email-service] sendTemplateEmail error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

// ============================================================================
// PREVIEW (render without sending)
// ============================================================================

/**
 * Render a template with variables for preview (no sending, no logging).
 */
export async function previewTemplateEmail(
  templateId: string,
  variables: Partial<EmailVariables>,
): Promise<{ subject: string; html: string } | null> {
  const template = await prisma.emailTemplate.findUnique({
    where: { id: templateId },
  });

  if (!template) return null;

  const varsMap: Record<string, string> = {};
  for (const [key, value] of Object.entries(variables)) {
    if (value !== undefined && value !== null) {
      varsMap[key] = String(value);
    }
  }

  return {
    subject: renderTemplate(template.subject, varsMap),
    html: wrapInEmailLayout(renderTemplate(template.htmlBody, varsMap)),
  };
}
