import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/crm/auth-guard";
import { emailPreviewSchema } from "@/lib/crm/validations";
import {
  previewTemplateEmail,
  buildVariablesFromLead,
} from "@/lib/crm/email-service";
import { prisma } from "@/lib/db";

/**
 * POST /api/admin/crm/emails/preview
 * Preview a rendered email template (no sending, no logging).
 */
export async function POST(request: Request) {
  try {
    const admin = await requireAuth();
    const body = await request.json();
    const data = emailPreviewSchema.parse(body);

    // If a leadId is provided, use real lead data for preview
    let variables: Record<string, string> = (data.variables ?? {}) as Record<string, string>;

    if (data.leadId) {
      const lead = await prisma.contactSubmission.findUnique({
        where: { id: data.leadId },
      });

      if (lead) {
        const leadVars = buildVariablesFromLead(lead);
        variables = { ...leadVars, ...variables };
      }
    }

    // Add admin name
    variables.admin_name = variables.admin_name ?? admin.name ?? "Tahina";

    // Provide sample values for empty variables
    const sampleVars: Record<string, string> = {
      prenom: "Marie",
      nom: "Laurent",
      email: "marie@example.com",
      service: "Site vitrine",
      budget: "1 000 – 3 000 €",
      entreprise: "Mon Entreprise",
      telephone: "06 12 34 56 78",
      message: "Bonjour, je souhaite créer un site web pour mon entreprise.",
      date_appel: "mercredi 12 mars 2025",
      heure_appel: "14:00",
      lien_calendly: "https://calendly.com/tahina-mitastudio/15min",
      lien_devis: "https://mita-studio.com/devis/example",
      recap_appel: "<p>Points abordés : site vitrine, SEO, livraison sous 2 semaines.</p>",
      admin_name: admin.name ?? "Tahina",
      lien_visio: "https://meet.google.com/abc-defg-hij",
      lien_reprogrammer: "https://calendly.com/reschedulings/example",
      lien_annuler: "https://calendly.com/cancellations/example",
    };

    // Merge: real vars override samples
    const mergedVars = { ...sampleVars, ...variables };

    const result = await previewTemplateEmail(data.templateId, mergedVars);

    if (!result) {
      return NextResponse.json(
        { error: "Template introuvable" },
        { status: 404 },
      );
    }

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    console.error("[emails/preview] Error:", err);
    return NextResponse.json(
      { error: "Erreur interne" },
      { status: 500 },
    );
  }
}
