import { prisma } from "@/lib/db";
import { EmailsPageClient } from "@/components/admin/emails-page-client";

export default async function EmailsPage() {
  const [templates, logsResult] = await Promise.all([
    prisma.emailTemplate.findMany({
      orderBy: { createdAt: "asc" },
    }),
    prisma.emailLog.findMany({
      orderBy: { sentAt: "desc" },
      take: 20,
      include: {
        lead: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
  ]);

  const totalLogs = await prisma.emailLog.count();

  // Get email stats (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [sentCount, openedCount, failedCount] = await Promise.all([
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

  const stats = {
    sent: sentCount,
    opened: openedCount,
    failed: failedCount,
    openRate: sentCount > 0 ? Math.round((openedCount / sentCount) * 100) : 0,
  };

  return (
    <EmailsPageClient
      templates={JSON.parse(JSON.stringify(templates))}
      initialLogs={JSON.parse(JSON.stringify(logsResult))}
      totalLogs={totalLogs}
      stats={stats}
    />
  );
}
