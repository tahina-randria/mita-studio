import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// 1x1 transparent GIF (43 bytes)
const TRANSPARENT_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64",
);

const HEADERS = {
  "Content-Type": "image/gif",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
} as const;

/**
 * GET /api/track/open/[token]
 * Public endpoint — called by email clients when they load the tracking pixel.
 * Returns a 1x1 transparent GIF and records the open event.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  // Always return the pixel immediately, even if the DB update fails
  const response = new NextResponse(TRANSPARENT_GIF, {
    status: 200,
    headers: HEADERS,
  });

  // Fire-and-forget: update the EmailLog
  try {
    const emailLog = await prisma.emailLog.findUnique({
      where: { openToken: token },
      select: { id: true, openCount: true, openedAt: true, leadId: true },
    });

    if (emailLog) {
      const isFirstOpen = emailLog.openCount === 0;

      // Increment open count + set first open timestamp
      await prisma.emailLog.update({
        where: { id: emailLog.id },
        data: {
          openCount: { increment: 1 },
          ...(isFirstOpen ? { openedAt: new Date() } : {}),
        },
      });

      // Create LeadActivity only on first open
      if (isFirstOpen && emailLog.leadId) {
        await prisma.leadActivity.create({
          data: {
            leadId: emailLog.leadId,
            type: "email_opened",
            title: "Email ouvert",
            details: { emailLogId: emailLog.id },
          },
        });
      }
    }
  } catch (err) {
    // Silently fail — we don't want to break the pixel response
    console.error("[track/open] Error:", err);
  }

  return response;
}
