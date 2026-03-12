import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/crm/auth-guard";
import { prisma } from "@/lib/db";

/**
 * GET /api/admin/crm/emails/templates
 * List all email templates.
 */
export async function GET() {
  try {
    await requireAuth();

    const templates = await prisma.emailTemplate.findMany({
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(templates);
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    console.error("[emails/templates] Error:", err);
    return NextResponse.json(
      { error: "Erreur interne" },
      { status: 500 },
    );
  }
}
