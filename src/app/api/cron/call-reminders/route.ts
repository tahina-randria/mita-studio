import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { executeTask } from "@/lib/crm/task-service";

/**
 * GET /api/cron/call-reminders
 * Process pending CrmTasks (call reminders, brief prep, no-show checks).
 * Protected by CRON_SECRET. Runs every 15 minutes via Vercel cron.
 */
export async function GET(request: Request) {
  try {
    // Auth check
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
      return NextResponse.json(
        { error: "CRON_SECRET not configured" },
        { status: 500 },
      );
    }

    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    // Fetch pending tasks that are due
    const dueTasks = await prisma.crmTask.findMany({
      where: {
        status: "pending",
        scheduledFor: { lte: now },
      },
      orderBy: { scheduledFor: "asc" },
      take: 50,
    });

    let processed = 0;
    let failed = 0;

    for (const task of dueTasks) {
      // Check max attempts
      if (task.attempts >= task.maxAttempts) {
        await prisma.crmTask.update({
          where: { id: task.id },
          data: {
            status: "failed",
            lastError: `Max attempts (${task.maxAttempts}) reached`,
          },
        });
        failed++;
        continue;
      }

      try {
        // Increment attempts
        await prisma.crmTask.update({
          where: { id: task.id },
          data: { attempts: task.attempts + 1 },
        });

        // Execute
        await executeTask(task);

        // Mark as completed
        await prisma.crmTask.update({
          where: { id: task.id },
          data: {
            status: "completed",
            executedAt: new Date(),
          },
        });

        processed++;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Unknown error";

        await prisma.crmTask.update({
          where: { id: task.id },
          data: {
            lastError: errorMsg,
            // Keep as pending for retry unless max attempts
            status:
              task.attempts + 1 >= task.maxAttempts ? "failed" : "pending",
          },
        });

        failed++;
        console.error(
          `[cron/call-reminders] Task ${task.id} (${task.type}) failed:`,
          errorMsg,
        );
      }
    }

    // Update ScheduledJob tracker
    await prisma.scheduledJob.upsert({
      where: { name: "call_reminders" },
      update: {
        lastRunAt: now,
        status: "idle",
        lastError: failed > 0 ? `${failed} tasks failed` : null,
      },
      create: {
        name: "call_reminders",
        description: "Process call reminders and task queue",
        cronExpr: "*/15 * * * *",
        lastRunAt: now,
        status: "idle",
      },
    });

    return NextResponse.json({
      success: true,
      found: dueTasks.length,
      processed,
      failed,
      timestamp: now.toISOString(),
    });
  } catch (err) {
    console.error("[cron/call-reminders] Error:", err);
    return NextResponse.json(
      {
        error: "Internal error",
        details: err instanceof Error ? err.message : "Unknown",
      },
      { status: 500 },
    );
  }
}
