import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { prisma } from "@/lib/db";

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.email("Adresse email invalide"),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    // Save to database
    const submission = await prisma.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        company: data.company ?? null,
        service: data.service ?? null,
        budget: data.budget ?? null,
        message: data.message,
        source: "website",
      },
    });

    // Send email notification via Resend (if configured)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL ?? "Mita Studio <tahina@mita-studio.com>",
          to: process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) ?? [
            "tahina@mita-studio.com",
          ],
          subject: `Nouveau contact — ${data.name} ${data.service ? `(${data.service})` : ""}`,
          html: `
            <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #0a0a0a; margin-bottom: 24px;">Nouveau message depuis mita-studio.com</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 120px;">Nom</td>
                  <td style="padding: 8px 0; font-weight: 600;">${data.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Email</td>
                  <td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td>
                </tr>
                ${data.phone ? `<tr><td style="padding: 8px 0; color: #666;">Téléphone</td><td style="padding: 8px 0;">${data.phone}</td></tr>` : ""}
                ${data.company ? `<tr><td style="padding: 8px 0; color: #666;">Entreprise</td><td style="padding: 8px 0;">${data.company}</td></tr>` : ""}
                ${data.service ? `<tr><td style="padding: 8px 0; color: #666;">Service</td><td style="padding: 8px 0;">${data.service}</td></tr>` : ""}
                ${data.budget ? `<tr><td style="padding: 8px 0; color: #666;">Budget</td><td style="padding: 8px 0;">${data.budget}</td></tr>` : ""}
              </table>
              <div style="margin-top: 24px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
                <p style="color: #666; margin: 0 0 8px; font-size: 13px;">Message</p>
                <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
              </div>
              <p style="margin-top: 24px; font-size: 12px; color: #999;">
                ID: ${submission.id} — ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        // Email failure should not block the submission
        console.error("[contact] Email notification failed:", emailError);
      }
    }

    return NextResponse.json(
      { success: true, id: submission.id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues },
        { status: 400 }
      );
    }

    console.error("[contact] Submission failed:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
