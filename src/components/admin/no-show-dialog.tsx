"use client";

import { useState } from "react";
import { UserX, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface NoShowDialogProps {
  leadId: string;
  leadName: string;
  noShowCount: number;
}

export function NoShowDialog({
  leadId,
  leadName,
  noShowCount,
}: NoShowDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sendRescheduleEmail, setSendRescheduleEmail] = useState(true);

  const willAutoLose = noShowCount + 1 >= 2;

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/admin/crm/leads/${leadId}/call-no-show`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sendRescheduleEmail }),
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
      setError(null);
      setSuccess(false);
      setSendRescheduleEmail(true);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50">
          <UserX className="size-4" />
          No-show
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserX className="size-5 text-red-600" />
            Marquer comme no-show
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8">
            <div className="rounded-full bg-red-50 p-3">
              <UserX className="size-6 text-red-600" />
            </div>
            <p className="text-lg font-medium text-gray-900">
              No-show enregistré
            </p>
            {willAutoLose && (
              <p className="text-sm text-red-600">Lead marqué LOST</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {leadName} n&apos;a pas honoré son appel.
              {noShowCount > 0 && (
                <span className="font-medium">
                  {" "}
                  C&apos;est son {noShowCount + 1}e no-show.
                </span>
              )}
            </p>

            {willAutoLose && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3">
                <AlertTriangle className="mt-0.5 size-4 text-red-600 shrink-0" />
                <p className="text-sm text-red-700">
                  Attention : ce lead sera automatiquement marqué LOST
                  après 2 no-shows.
                </p>
              </div>
            )}

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={sendRescheduleEmail}
                onChange={(e) => setSendRescheduleEmail(e.target.checked)}
                className="accent-gray-900"
              />
              Envoyer un email de reprogrammation
            </label>

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
                variant="destructive"
                onClick={handleSubmit}
                disabled={submitting}
                className="gap-1.5"
              >
                {submitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <UserX className="size-4" />
                )}
                Confirmer no-show
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
