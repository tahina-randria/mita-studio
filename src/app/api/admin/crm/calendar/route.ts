import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/crm/auth-guard";
import { calendarQuerySchema } from "@/lib/crm/validations";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const parsed = calendarQuerySchema.safeParse({
      start: searchParams.get("start"),
      end: searchParams.get("end"),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres start et end requis (ISO 8601)." },
        { status: 400 },
      );
    }

    const startDate = new Date(parsed.data.start);
    const endDate = new Date(parsed.data.end);

    // Fetch all leads with calls scheduled in the date range
    const leads = await prisma.contactSubmission.findMany({
      where: {
        callScheduledAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        service: true,
        budget: true,
        score: true,
        stage: true,
        callScheduledAt: true,
        callCompletedAt: true,
        callResult: true,
        callVideoLink: true,
        callDurationMinutes: true,
        callNotes: true,
        isNoShow: true,
        noShowCount: true,
      },
      orderBy: { callScheduledAt: "asc" },
    });

    // Transform to calendar events
    const events = leads.map((lead) => ({
      id: lead.id,
      title: lead.name,
      start: lead.callScheduledAt!.toISOString(),
      end: lead.callScheduledAt
        ? new Date(
            lead.callScheduledAt.getTime() + 30 * 60 * 1000,
          ).toISOString()
        : null,
      // Color coding by status
      color: getEventColor(lead.stage, lead.callResult, lead.isNoShow),
      // Lead data for detail panel
      lead: {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        service: lead.service,
        budget: lead.budget,
        score: lead.score,
        stage: lead.stage,
        callResult: lead.callResult,
        callVideoLink: lead.callVideoLink,
        callDurationMinutes: lead.callDurationMinutes,
        callNotes: lead.callNotes,
        isNoShow: lead.isNoShow,
        noShowCount: lead.noShowCount,
      },
    }));

    return NextResponse.json({ events });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }
    console.error("[calendar] GET error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 },
    );
  }
}

function getEventColor(
  stage: string,
  callResult: string | null,
  isNoShow: boolean,
): string {
  if (isNoShow) return "#ef4444"; // red
  if (callResult === "good_fit") return "#22c55e"; // green
  if (callResult === "medium_fit") return "#f59e0b"; // amber
  if (callResult === "bad_fit") return "#6b7280"; // gray
  if (stage === "CALL_BOOKED") return "#3b82f6"; // blue (upcoming)
  if (stage === "CALL_DONE") return "#22c55e"; // green
  return "#8b5cf6"; // purple (default)
}
