import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getLeads } from "@/lib/crm/queries";
import { leadsQuerySchema } from "@/lib/crm/validations";
import { requireAuth } from "@/lib/crm/auth-guard";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = request.nextUrl;
    const params = Object.fromEntries(searchParams.entries());
    const parsed = leadsQuerySchema.safeParse(params);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides." },
        { status: 400 }
      );
    }

    const result = await getLeads(parsed.data);
    return NextResponse.json(result);
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
