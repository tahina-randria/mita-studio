import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/crm/auth-guard";
import { updateTemplateSchema } from "@/lib/crm/validations";
import { prisma } from "@/lib/db";

/**
 * GET /api/admin/crm/emails/templates/[id]
 * Get a single template by ID.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
    const { id } = await params;

    const template = await prisma.emailTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template introuvable" },
        { status: 404 },
      );
    }

    return NextResponse.json(template);
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    console.error("[emails/templates/[id]] GET Error:", err);
    return NextResponse.json(
      { error: "Erreur interne" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/admin/crm/emails/templates/[id]
 * Update a template's subject, body, or active status.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const data = updateTemplateSchema.parse(body);

    const existing = await prisma.emailTemplate.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Template introuvable" },
        { status: 404 },
      );
    }

    const updated = await prisma.emailTemplate.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    console.error("[emails/templates/[id]] PATCH Error:", err);
    return NextResponse.json(
      { error: "Erreur interne" },
      { status: 500 },
    );
  }
}
