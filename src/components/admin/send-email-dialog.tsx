"use client";

import { useState, useEffect } from "react";
import { Mail, Send, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TEMPLATE_LABELS, type TemplateName } from "@/types/crm";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  active: boolean;
}

interface SendEmailDialogProps {
  leadId: string;
  leadName: string;
  leadEmail: string;
}

export function SendEmailDialog({
  leadId,
  leadName,
  leadEmail,
}: SendEmailDialogProps) {
  const [open, setOpen] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewSubject, setPreviewSubject] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "preview">("select");

  // ── Fetch templates on open ──
  useEffect(() => {
    if (open && templates.length === 0) {
      fetch("/api/admin/crm/emails/templates")
        .then((res) => res.json())
        .then((data) => setTemplates(data))
        .catch(() => {});
    }
  }, [open, templates.length]);

  // ── Preview selected template ──
  async function handlePreview() {
    if (!selectedTemplate) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/crm/emails/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: selectedTemplate,
          leadId,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setPreviewHtml(data.html);
        setPreviewSubject(data.subject);
        setStep("preview");
      } else {
        setError("Erreur lors du chargement de la preview");
      }
    } catch {
      setError("Erreur réseau");
    }
    setLoading(false);
  }

  // ── Send email ──
  async function handleSend() {
    if (!selectedTemplate) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/crm/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: selectedTemplate,
          leadId,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSent(true);
        // Auto-close after 2s
        setTimeout(() => {
          setOpen(false);
          setSent(false);
          setStep("select");
          setSelectedTemplate("");
          setPreviewHtml("");
          // Refresh page to show new activity
          window.location.reload();
        }, 2000);
      } else {
        setError(data.error ?? "Erreur lors de l'envoi");
      }
    } catch {
      setError("Erreur réseau");
    }
    setSending(false);
  }

  // ── Reset on close ──
  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) {
      setStep("select");
      setSelectedTemplate("");
      setPreviewHtml("");
      setError(null);
      setSent(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Mail className="size-4" />
          Envoyer un email
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="size-5" />
            {step === "select"
              ? "Envoyer un email"
              : `Preview — ${previewSubject}`}
          </DialogTitle>
          <p className="text-sm text-gray-500">
            À : {leadName} ({leadEmail})
          </p>
        </DialogHeader>

        {/* ─── Step 1: Template selection ─── */}
        {step === "select" && (
          <div className="flex-1 space-y-4 overflow-auto">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Choisir un template
              </label>
              <div className="space-y-1">
                {templates
                  .filter((t) => t.active)
                  .map((template) => (
                    <label
                      key={template.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                        selectedTemplate === template.id
                          ? "border-gray-900 bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="template"
                        value={template.id}
                        checked={selectedTemplate === template.id}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        className="accent-gray-900"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {TEMPLATE_LABELS[template.name as TemplateName] ??
                            template.name}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {template.subject}
                        </p>
                      </div>
                    </label>
                  ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex items-center justify-end gap-2 border-t border-gray-200 pt-4">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={handlePreview}
                disabled={!selectedTemplate || loading}
                className="gap-1.5"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Eye className="size-4" />
                )}
                Prévisualiser
              </Button>
            </div>
          </div>
        )}

        {/* ─── Step 2: Preview & send ─── */}
        {step === "preview" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {sent ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 py-12">
                <div className="rounded-full bg-emerald-50 p-3">
                  <Send className="size-6 text-emerald-600" />
                </div>
                <p className="text-lg font-medium text-gray-900">
                  Email envoyé !
                </p>
                <p className="text-sm text-gray-500">
                  L&apos;email a été envoyé à {leadEmail}
                </p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-auto">
                  <iframe
                    srcDoc={previewHtml}
                    className="h-[500px] w-full rounded border border-gray-200"
                    title="Email preview"
                    sandbox=""
                  />
                </div>

                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}

                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setStep("select")}
                    disabled={sending}
                  >
                    Retour
                  </Button>
                  <Button
                    onClick={handleSend}
                    disabled={sending}
                    className="gap-1.5"
                  >
                    {sending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Send className="size-4" />
                    )}
                    Envoyer
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
