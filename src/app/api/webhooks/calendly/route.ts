import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  verifyCalendlySignature,
  processInviteeCreated,
  processInviteeCanceled,
} from "@/lib/crm/calendly";

/**
 * POST /api/webhooks/calendly
 * Calendly webhook endpoint — public (no admin auth).
 * Always returns 200 to avoid Calendly retries.
 */
export async function POST(request: Request) {
  let rawBody = "";

  try {
    rawBody = await request.text();

    // Optional signature verification
    const secret = process.env.CALENDLY_WEBHOOK_SECRET ?? null;
    const signature =
      request.headers.get("calendly-webhook-signature") ?? null;

    if (secret && !verifyCalendlySignature(rawBody, signature, secret)) {
      // Log but still return 200
      await prisma.webhookLog.create({
        data: {
          source: "calendly",
          event: "signature_invalid",
          payload: {},
          status: "failed",
          error: "Invalid webhook signature",
        },
      });
      return NextResponse.json({ received: true });
    }

    const data = JSON.parse(rawBody);
    const event = data.event as string | undefined;

    // Log webhook
    const log = await prisma.webhookLog.create({
      data: {
        source: "calendly",
        event: event ?? "unknown",
        payload: data,
        status: "received",
      },
    });

    // Process event
    let result: { success: boolean; error?: string } = { success: true };

    switch (event) {
      case "invitee.created":
        result = await processInviteeCreated(data);
        break;

      case "invitee.canceled":
        result = await processInviteeCanceled(data);
        break;

      default:
        // Unhandled event — just log
        console.log(`[calendly-webhook] Unhandled event: ${event}`);
    }

    // Update log status
    await prisma.webhookLog.update({
      where: { id: log.id },
      data: {
        status: result.success ? "processed" : "failed",
        error: result.error ?? null,
      },
    });
  } catch (err) {
    console.error("[calendly-webhook] Error:", err);

    // Try to log the error
    try {
      await prisma.webhookLog.create({
        data: {
          source: "calendly",
          event: "processing_error",
          payload: rawBody ? JSON.parse(rawBody) : {},
          status: "failed",
          error: err instanceof Error ? err.message : "Unknown error",
        },
      });
    } catch {
      // Silent — don't fail the webhook response
    }
  }

  // Always return 200 to avoid Calendly retries
  return NextResponse.json({ received: true });
}
