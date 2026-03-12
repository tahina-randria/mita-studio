import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/crm/queries";
import { requireAuth } from "@/lib/crm/auth-guard";

export async function GET() {
  try {
    await requireAuth();

    const stats = await getDashboardStats();
    return NextResponse.json(stats);
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
