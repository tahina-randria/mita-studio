import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/crm/auth-guard";
import { sendEmailSchema } from "@/lib/crm/validations";
import {
  sendTemplateEmail,
  buildVariablesFromLead,
} from "@/lib/crm/email-service";
import { prisma } from "@/lib/db";

/**
 * POST /api/admin/crm/emails/send
 * Send a templated email to a lead.
 */
export async function POST(request: Request) {
  try {
    const admin = await requireAuth();
    const body = await request.json();
    const data = sendEmailSchema.parse(body);

    // Fetch the lead
    const lead = await prisma.contactSubmission.findUnique({
      where: { id: data.leadId },
    });

    if (!lead) {
      return NextResponse.json(
        { error: "Lead introuvable" },
        { status: 404 },
      );
    }

    // Build variables from lead data
    const variables = buildVariablesFromLead(lead);

    // Send the email
    const result = await sendTemplateEmail({
      templateId: data.templateId,
      to: lead.email,
      leadId: lead.id,
      variables: {
        ...variables,
        admin_name: admin.name ?? "Tahina",
      },
      adminId: admin.id,
      customSubject: data.customSubject,
      customHtml: data.customHtml,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? "Erreur lors de l'envoi" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      emailLogId: result.emailLogId,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    console.error("[emails/send] Error:", err);
    return NextResponse.json(
      { error: "Erreur interne" },
      { status: 500 },
    );
  }
}
