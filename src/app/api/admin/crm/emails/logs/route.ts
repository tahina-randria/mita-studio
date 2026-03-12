import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/crm/auth-guard";
import { emailLogQuerySchema } from "@/lib/crm/validations";
import { prisma } from "@/lib/db";

/**
 * GET /api/admin/crm/emails/logs
 * List email logs with pagination and optional filters.
 */
export async function GET(request: Request) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const query = emailLogQuerySchema.parse({
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      leadId: searchParams.get("leadId") ?? undefined,
    });

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.leadId) where.leadId = query.leadId;

    const [logs, total] = await Promise.all([
      prisma.emailLog.findMany({
        where,
        orderBy: { sentAt: "desc" },
        skip,
        take: limit,
        include: {
          lead: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.emailLog.count({ where }),
    ]);

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    console.error("[emails/logs] Error:", err);
    return NextResponse.json(
      { error: "Erreur interne" },
      { status: 500 },
    );
  }
}
