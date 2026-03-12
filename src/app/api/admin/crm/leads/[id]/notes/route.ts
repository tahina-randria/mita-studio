import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { createNoteSchema } from "@/lib/crm/validations";
import { requireAuth } from "@/lib/crm/auth-guard";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAuth();
    const { id } = await params;

    const body = await request.json();
    const parsed = createNoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Contenu requis." },
        { status: 400 }
      );
    }

    // Check lead exists
    const lead = await prisma.contactSubmission.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!lead) {
      return NextResponse.json(
        { error: "Lead introuvable." },
        { status: 404 }
      );
    }

    // Create note
    const note = await prisma.leadNote.create({
      data: {
        leadId: id,
        content: parsed.data.content,
        pinned: parsed.data.pinned ?? false,
        adminId: admin.id,
      },
    });

    // Create activity
    await prisma.leadActivity.create({
      data: {
        leadId: id,
        type: "note_added",
        title: "Note ajoutée",
        details: {
          noteId: note.id,
          preview: parsed.data.content.slice(0, 100),
        },
        adminId: admin.id,
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }
    console.error("[leads/[id]/notes] POST error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}
