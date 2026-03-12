import { prisma } from "@/lib/db";
import type { PipelineStage } from "@/types/crm";
import { PIPELINE_STAGES } from "@/types/crm";

// ── Lead queries ──

interface LeadFilters {
  search?: string;
  stage?: PipelineStage;
  sortBy?: "createdAt" | "score" | "name" | "updatedAt";
  sortDir?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export async function getLeads(filters: LeadFilters = {}) {
  const {
    search,
    stage,
    sortBy = "createdAt",
    sortDir = "desc",
    page = 1,
    limit = 20,
  } = filters;

  const where: Record<string, unknown> = {};

  if (stage) {
    where.stage = stage;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
    ];
  }

  const [leads, total] = await Promise.all([
    prisma.contactSubmission.findMany({
      where,
      orderBy: { [sortBy]: sortDir },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        service: true,
        budget: true,
        stage: true,
        score: true,
        status: true,
        dealValue: true,
        isNoShow: true,
        nextFollowUpAt: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.contactSubmission.count({ where }),
  ]);

  return {
    leads,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getLeadById(id: string) {
  return prisma.contactSubmission.findUnique({
    where: { id },
    include: {
      activities: {
        orderBy: { createdAt: "desc" },
        take: 50,
      },
      leadNotes: {
        orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
      },
      proposals: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

// ── Dashboard stats ──

export async function getDashboardStats() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Monday
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    todayLeads,
    weekLeads,
    monthLeads,
    totalLeads,
    stageCounts,
    wonDeals,
    pipelineValue,
    recentActivity,
  ] = await Promise.all([
    // Leads today
    prisma.contactSubmission.count({
      where: { createdAt: { gte: todayStart } },
    }),
    // Leads this week
    prisma.contactSubmission.count({
      where: { createdAt: { gte: weekStart } },
    }),
    // Leads this month
    prisma.contactSubmission.count({
      where: { createdAt: { gte: monthStart } },
    }),
    // Total leads
    prisma.contactSubmission.count(),
    // Stage counts
    prisma.contactSubmission.groupBy({
      by: ["stage"],
      _count: { id: true },
    }),
    // Won deals count
    prisma.contactSubmission.count({
      where: { stage: "WON" },
    }),
    // Pipeline value (sum of dealValue for active leads)
    prisma.contactSubmission.aggregate({
      _sum: { dealValue: true },
      where: {
        stage: { notIn: ["WON", "LOST"] },
        dealValue: { not: null },
      },
    }),
    // Recent activity
    prisma.leadActivity.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        lead: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
  ]);

  // Calculate conversion rate
  const conversionRate =
    totalLeads > 0 ? ((wonDeals / totalLeads) * 100).toFixed(1) : "0.0";

  // Build stage counts map
  const stageCountsMap: Record<string, number> = {};
  for (const stage of PIPELINE_STAGES) {
    stageCountsMap[stage] = 0;
  }
  for (const item of stageCounts) {
    stageCountsMap[item.stage] = item._count.id;
  }

  return {
    todayLeads,
    weekLeads,
    monthLeads,
    totalLeads,
    conversionRate,
    pipelineValue: pipelineValue._sum.dealValue ?? 0,
    stageCounts: stageCountsMap,
    recentActivity,
  };
}

export async function getStageCounts() {
  const counts = await prisma.contactSubmission.groupBy({
    by: ["stage"],
    _count: { id: true },
  });

  const result: Record<string, number> = {};
  for (const stage of PIPELINE_STAGES) {
    result[stage] = 0;
  }
  for (const item of counts) {
    result[item.stage] = item._count.id;
  }
  return result;
}

// ── Email queries ──

export async function getEmailsForLead(leadId: string) {
  return prisma.emailLog.findMany({
    where: { leadId },
    orderBy: { sentAt: "desc" },
    select: {
      id: true,
      subject: true,
      status: true,
      openCount: true,
      openedAt: true,
      sentAt: true,
      to: true,
    },
  });
}

export async function getEmailStats() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [sent, opened, failed] = await Promise.all([
    prisma.emailLog.count({
      where: { status: "sent", sentAt: { gte: thirtyDaysAgo } },
    }),
    prisma.emailLog.count({
      where: { openCount: { gt: 0 }, sentAt: { gte: thirtyDaysAgo } },
    }),
    prisma.emailLog.count({
      where: { status: "failed", sentAt: { gte: thirtyDaysAgo } },
    }),
  ]);

  return {
    sent,
    opened,
    failed,
    openRate: sent > 0 ? Math.round((opened / sent) * 100) : 0,
  };
}
