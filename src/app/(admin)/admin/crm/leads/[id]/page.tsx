import { notFound } from "next/navigation";
import Link from "next/link";
import { getLeadById } from "@/lib/crm/queries";
import {
  STAGE_LABELS,
  STAGE_TEXT_COLORS,
  LOST_REASONS,
} from "@/types/crm";
import type { PipelineStage, ScoreBreakdown } from "@/types/crm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
  FileText,
} from "lucide-react";
import { LeadStageSelector } from "@/components/admin/lead-stage-selector";
import { LeadNoteForm } from "@/components/admin/lead-note-form";
import { SendEmailDialog } from "@/components/admin/send-email-dialog";
import { CallBriefPanel } from "@/components/admin/call-brief-panel";
import { PostCallNotesDialog } from "@/components/admin/post-call-notes-dialog";
import { NoShowDialog } from "@/components/admin/no-show-dialog";

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

function formatDate(date: Date | string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function ScoreBar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-gray-900 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const lead = await getLeadById(id);

  if (!lead) {
    notFound();
  }

  const breakdown = (lead.scoreBreakdown as unknown as ScoreBreakdown) || {
    budget: 0,
    service: 0,
    urgency: 0,
    engagement: 0,
    company: 0,
  };

  const lostReason = LOST_REASONS.find((r) => r.value === lead.lostReason);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/crm/leads"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
            <Badge
              variant="secondary"
              className={`${STAGE_TEXT_COLORS[lead.stage as PipelineStage] || ""}`}
            >
              {STAGE_LABELS[lead.stage as PipelineStage] || lead.stage}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Créé le {formatDate(lead.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {lead.stage === "CALL_BOOKED" && (
            <>
              <PostCallNotesDialog
                leadId={lead.id}
                leadName={lead.name}
              />
              <NoShowDialog
                leadId={lead.id}
                leadName={lead.name}
                noShowCount={lead.noShowCount}
              />
            </>
          )}
          <SendEmailDialog
            leadId={lead.id}
            leadName={lead.name}
            leadEmail={lead.email}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Info + Score */}
        <div className="space-y-6 lg:col-span-1">
          {/* Lead info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <a
                  href={`mailto:${lead.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {lead.email}
                </a>
              </div>
              {lead.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <a
                    href={`tel:${lead.phone}`}
                    className="text-gray-700 hover:underline"
                  >
                    {lead.phone}
                  </a>
                </div>
              )}
              {lead.company && (
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{lead.company}</span>
                </div>
              )}
              {lead.service && (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{lead.service}</span>
                </div>
              )}
              {lead.budget && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">€</span>
                  <span className="text-gray-700">{lead.budget}</span>
                </div>
              )}
              {lead.nextFollowUpAt && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">
                    Follow-up : {formatDate(lead.nextFollowUpAt)}
                  </span>
                </div>
              )}
              {lead.dealValue && (
                <div className="mt-3 border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-500">Valeur du deal</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(lead.dealValue)}
                  </p>
                </div>
              )}
              {lostReason && (
                <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  Raison perte : {lostReason.label}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Call brief / results */}
          {(lead.callScheduledAt || lead.callResult) && (
            <CallBriefPanel lead={lead} />
          )}

          {/* Message */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Message</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm text-gray-700">
                {lead.message}
              </p>
            </CardContent>
          </Card>

          {/* Score */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Score</CardTitle>
              <span className="text-2xl font-bold text-gray-900">
                {lead.score}
                <span className="text-sm font-normal text-gray-400">/100</span>
              </span>
            </CardHeader>
            <CardContent className="space-y-3">
              <ScoreBar label="Budget" value={breakdown.budget} max={40} />
              <ScoreBar label="Service" value={breakdown.service} max={30} />
              <ScoreBar label="Urgence" value={breakdown.urgency} max={15} />
              <ScoreBar
                label="Engagement"
                value={breakdown.engagement}
                max={10}
              />
              <ScoreBar label="Entreprise" value={breakdown.company} max={5} />
            </CardContent>
          </Card>

          {/* Stage selector */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Changer le stage</CardTitle>
            </CardHeader>
            <CardContent>
              <LeadStageSelector
                leadId={lead.id}
                currentStage={lead.stage as PipelineStage}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right column: Timeline + Notes */}
        <div className="space-y-6 lg:col-span-2">
          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Notes ({lead.leadNotes.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <LeadNoteForm leadId={lead.id} />
              {lead.leadNotes.length > 0 && (
                <div className="space-y-3 border-t border-gray-100 pt-4">
                  {lead.leadNotes.map((note) => (
                    <div
                      key={note.id}
                      className={`rounded-lg border p-3 ${
                        note.pinned
                          ? "border-amber-200 bg-amber-50"
                          : "border-gray-100 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {note.pinned && (
                            <span className="text-xs text-amber-600">📌</span>
                          )}
                          <span className="text-xs text-gray-400">
                            {formatDate(note.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                        {note.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Activités ({lead.activities.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lead.activities.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-400">
                  Aucune activité
                </p>
              ) : (
                <div className="space-y-4">
                  {lead.activities.map((activity, idx) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                          <Clock className="h-3 w-3 text-gray-500" />
                        </div>
                        {idx < lead.activities.length - 1 && (
                          <div className="mt-1 w-px flex-1 bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
