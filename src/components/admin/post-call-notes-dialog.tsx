"use client";

import { useState } from "react";
import {
  Phone,
  CheckCircle2,
  Loader2,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CALL_RESULT_LABELS, type CallResult } from "@/types/crm";

interface PostCallNotesDialogProps {
  leadId: string;
  leadName: string;
}

export function PostCallNotesDialog({
  leadId,
  leadName,
}: PostCallNotesDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [callResult, setCallResult] = useState<string>("");
  const [callDurationMinutes, setCallDurationMinutes] = useState<string>("");
  const [callNotes, setCallNotes] = useState("");
  const [callBudgetDiscussed, setCallBudgetDiscussed] = useState(false);
  const [callUrgencyDiscussed, setCallUrgencyDiscussed] = useState(false);
  const [callIsDecisionMaker, setCallIsDecisionMaker] = useState(false);
  const [callNextAction, setCallNextAction] = useState("");
  const [callEstimatedAmount, setCallEstimatedAmount] = useState("");
  const [sendRecapEmail, setSendRecapEmail] = useState(false);
  const [recapContent, setRecapContent] = useState("");

  async function handleSubmit() {
    if (!callResult) {
      setError("Veuillez sélectionner un résultat d'appel.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const body: Record<string, unknown> = {
        callResult,
        callNotes: callNotes || undefined,
        callBudgetDiscussed,
        callUrgencyDiscussed,
        callIsDecisionMaker,
        callNextAction: callNextAction || undefined,
      };

      if (callDurationMinutes) {
        body.callDurationMinutes = parseInt(callDurationMinutes, 10);
      }

      if (callEstimatedAmount) {
        body.callEstimatedAmountCents = Math.round(
          parseFloat(callEstimatedAmount) * 100,
        );
      }

      if (sendRecapEmail && recapContent) {
        body.sendRecapEmail = true;
        body.recapContent = recapContent;
      }

      const res = await fetch(
        `/api/admin/crm/leads/${leadId}/call-complete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          setOpen(false);
          window.location.reload();
        }, 1500);
      } else {
        setError(data.error ?? "Erreur lors de l'enregistrement.");
      }
    } catch {
      setError("Erreur réseau.");
    }

    setSubmitting(false);
  }

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) {
      setCallResult("");
      setCallDurationMinutes("");
      setCallNotes("");
      setCallBudgetDiscussed(false);
      setCallUrgencyDiscussed(false);
      setCallIsDecisionMaker(false);
      setCallNextAction("");
      setCallEstimatedAmount("");
      setSendRecapEmail(false);
      setRecapContent("");
      setError(null);
      setSuccess(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <CheckCircle2 className="size-4" />
          Appel terminé
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="size-5" />
            Notes post-appel — {leadName}
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12">
            <div className="rounded-full bg-emerald-50 p-3">
              <CheckCircle2 className="size-6 text-emerald-600" />
            </div>
            <p className="text-lg font-medium text-gray-900">
              Appel enregistré !
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Call result */}
            <div className="space-y-1.5">
              <Label>Résultat de l&apos;appel *</Label>
              <Select value={callResult} onValueChange={setCallResult}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {(
                    Object.entries(CALL_RESULT_LABELS) as [
                      CallResult,
                      string,
                    ][]
                  )
                    .filter(([key]) => key !== "no_show")
                    .map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <Label>Durée (minutes)</Label>
              <Input
                type="number"
                min="1"
                placeholder="30"
                value={callDurationMinutes}
                onChange={(e) => setCallDurationMinutes(e.target.value)}
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea
                placeholder="Résumé de l'appel, points clés discutés..."
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                rows={4}
              />
            </div>

            {/* Qualifications checkboxes */}
            <div className="space-y-2">
              <Label>Qualifications</Label>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={callBudgetDiscussed}
                    onChange={(e) => setCallBudgetDiscussed(e.target.checked)}
                    className="accent-gray-900"
                  />
                  Budget discuté
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={callUrgencyDiscussed}
                    onChange={(e) => setCallUrgencyDiscussed(e.target.checked)}
                    className="accent-gray-900"
                  />
                  Urgence identifiée
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={callIsDecisionMaker}
                    onChange={(e) => setCallIsDecisionMaker(e.target.checked)}
                    className="accent-gray-900"
                  />
                  Décideur
                </label>
              </div>
            </div>

            {/* Next action */}
            <div className="space-y-1.5">
              <Label>Prochaine action</Label>
              <Input
                placeholder="Ex: Envoyer un devis, Planifier un 2e appel..."
                value={callNextAction}
                onChange={(e) => setCallNextAction(e.target.value)}
              />
            </div>

            {/* Estimated amount */}
            <div className="space-y-1.5">
              <Label>Montant estimé (EUR)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="890"
                value={callEstimatedAmount}
                onChange={(e) => setCallEstimatedAmount(e.target.value)}
              />
            </div>

            {/* Send recap email */}
            <div className="space-y-2 rounded-lg border border-gray-200 p-3">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={sendRecapEmail}
                  onChange={(e) => setSendRecapEmail(e.target.checked)}
                  className="accent-gray-900"
                />
                <Send className="size-4 text-gray-400" />
                Envoyer un email récap au lead
              </label>
              {sendRecapEmail && (
                <Textarea
                  placeholder="Résumé à envoyer au client..."
                  value={recapContent}
                  onChange={(e) => setRecapContent(e.target.value)}
                  rows={3}
                />
              )}
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex justify-end gap-2 border-t border-gray-200 pt-4">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting || !callResult}
                className="gap-1.5"
              >
                {submitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="size-4" />
                )}
                Enregistrer
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
