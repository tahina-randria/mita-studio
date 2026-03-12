"use client";

import {
  Phone,
  Video,
  Calendar,
  Clock,
  ExternalLink,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CALL_RESULT_LABELS,
  CALL_RESULT_COLORS,
  type CallResult,
} from "@/types/crm";

interface CallBriefPanelProps {
  lead: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    company?: string | null;
    service?: string | null;
    budget?: string | null;
    score: number;
    stage: string;
    message: string;
    callScheduledAt?: string | Date | null;
    callCompletedAt?: string | Date | null;
    callVideoLink?: string | null;
    callRescheduleUrl?: string | null;
    callCancelUrl?: string | null;
    callResult?: string | null;
    callDurationMinutes?: number | null;
    callNotes?: string | null;
    callBudgetDiscussed?: boolean | null;
    callUrgencyDiscussed?: boolean | null;
    callIsDecisionMaker?: boolean | null;
    callNextAction?: string | null;
    callEstimatedAmountCents?: number | null;
    isNoShow: boolean;
    noShowCount: number;
  };
}

function formatCallDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = new Date(date);
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  });
}

export function CallBriefPanel({ lead }: CallBriefPanelProps) {
  const isBooked = lead.stage === "CALL_BOOKED";
  const isDone = lead.stage === "CALL_DONE" || !!lead.callResult;
  const callDate = lead.callScheduledAt
    ? new Date(lead.callScheduledAt)
    : null;
  const isUpcoming = callDate && callDate > new Date();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <Phone className="size-4" />
          {isDone ? "Résultat appel" : "Appel planifié"}
        </CardTitle>
        {lead.callResult && (
          <Badge
            className={
              CALL_RESULT_COLORS[lead.callResult as CallResult] ?? ""
            }
          >
            {CALL_RESULT_LABELS[lead.callResult as CallResult] ??
              lead.callResult}
          </Badge>
        )}
        {isBooked && lead.isNoShow && (
          <Badge className="text-red-700 bg-red-50">
            No-show ({lead.noShowCount}x)
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Call date */}
        {callDate && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="size-4 text-gray-400" />
            <span className="text-gray-700">{formatCallDate(callDate)}</span>
            {isUpcoming && (
              <Badge variant="secondary" className="text-xs">
                A venir
              </Badge>
            )}
          </div>
        )}

        {/* Duration */}
        {lead.callDurationMinutes && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="size-4 text-gray-400" />
            <span className="text-gray-700">
              {lead.callDurationMinutes} min
            </span>
          </div>
        )}

        {/* Video link */}
        {lead.callVideoLink && isUpcoming && (
          <a
            href={lead.callVideoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
          >
            <Video className="size-4" />
            Rejoindre la visio
            <ExternalLink className="size-3" />
          </a>
        )}

        {/* Reschedule / Cancel links */}
        {isBooked && isUpcoming && (
          <div className="flex gap-2 pt-1">
            {lead.callRescheduleUrl && (
              <a
                href={lead.callRescheduleUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <RefreshCw className="size-3" />
                  Reprogrammer
                </Button>
              </a>
            )}
            {lead.callCancelUrl && (
              <a
                href={lead.callCancelUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="gap-1.5 text-xs text-red-600 hover:text-red-700">
                  <XCircle className="size-3" />
                  Annuler
                </Button>
              </a>
            )}
          </div>
        )}

        {/* Brief (upcoming call) */}
        {isBooked && isUpcoming && (
          <div className="mt-3 space-y-2 rounded-lg border border-blue-100 bg-blue-50 p-3">
            <p className="text-xs font-medium text-blue-800">
              Brief avant appel
            </p>
            <div className="space-y-1 text-xs text-blue-700">
              <p>Service : {lead.service ?? "Non renseigné"}</p>
              <p>Budget : {lead.budget ?? "Non renseigné"}</p>
              <p>Entreprise : {lead.company ?? "Non renseigné"}</p>
              <p>Score : {lead.score}/100</p>
              {lead.message && (
                <p className="mt-1 line-clamp-3">
                  Message : {lead.message}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Call notes (completed) */}
        {isDone && lead.callNotes && (
          <div className="mt-3 space-y-1 rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-600">Notes d&apos;appel</p>
            <p className="whitespace-pre-wrap text-sm text-gray-700">
              {lead.callNotes}
            </p>
          </div>
        )}

        {/* Call qualifications */}
        {isDone && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {lead.callBudgetDiscussed && (
              <Badge variant="secondary" className="text-xs">
                Budget discuté
              </Badge>
            )}
            {lead.callUrgencyDiscussed && (
              <Badge variant="secondary" className="text-xs">
                Urgence identifiée
              </Badge>
            )}
            {lead.callIsDecisionMaker && (
              <Badge variant="secondary" className="text-xs">
                Décideur
              </Badge>
            )}
          </div>
        )}

        {/* Next action */}
        {lead.callNextAction && (
          <div className="mt-2 text-sm">
            <span className="text-gray-500">Prochaine action : </span>
            <span className="font-medium text-gray-700">
              {lead.callNextAction}
            </span>
          </div>
        )}

        {/* Estimated amount */}
        {lead.callEstimatedAmountCents && (
          <div className="text-sm">
            <span className="text-gray-500">Montant estimé : </span>
            <span className="font-semibold text-gray-900">
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
                minimumFractionDigits: 0,
              }).format(lead.callEstimatedAmountCents / 100)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
