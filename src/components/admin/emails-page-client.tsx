"use client";

import { useState } from "react";
import {
  Mail,
  Send,
  Eye,
  AlertCircle,
  BarChart3,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TEMPLATE_LABELS,
  EMAIL_STATUS_LABELS,
  EMAIL_STATUS_COLORS,
  type TemplateName,
  type EmailStatus,
} from "@/types/crm";

// ============================================================================
// TYPES
// ============================================================================

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlBody: string;
  textBody: string | null;
  variables: string[] | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EmailLog {
  id: string;
  to: string;
  from: string;
  subject: string;
  status: string;
  openCount: number;
  openedAt: string | null;
  sentAt: string;
  lead: { id: string; name: string; email: string } | null;
}

interface EmailStats {
  sent: number;
  opened: number;
  failed: number;
  openRate: number;
}

interface EmailsPageClientProps {
  templates: EmailTemplate[];
  initialLogs: EmailLog[];
  totalLogs: number;
  stats: EmailStats;
}

// ============================================================================
// HELPERS
// ============================================================================

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: string }) {
  const colors =
    EMAIL_STATUS_COLORS[status as EmailStatus] ?? "text-gray-700 bg-gray-50";
  const label =
    EMAIL_STATUS_LABELS[status as EmailStatus] ?? status;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${colors}`}
    >
      {status === "sent" && <CheckCircle className="size-3" />}
      {status === "failed" && <XCircle className="size-3" />}
      {status === "sending" && <Clock className="size-3" />}
      {label}
    </span>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function EmailsPageClient({
  templates,
  initialLogs,
  totalLogs,
  stats,
}: EmailsPageClientProps) {
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(
    null,
  );
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [editTemplate, setEditTemplate] = useState<EmailTemplate | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");
  const [saving, setSaving] = useState(false);

  // ── Preview template ──
  async function handlePreview(template: EmailTemplate) {
    setPreviewTemplate(template);
    setPreviewLoading(true);
    try {
      const res = await fetch("/api/admin/crm/emails/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: template.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setPreviewHtml(data.html);
      }
    } catch {
      // Preview failed silently
    }
    setPreviewLoading(false);
  }

  // ── Edit template ──
  function handleEdit(template: EmailTemplate) {
    setEditTemplate(template);
    setEditSubject(template.subject);
    setEditBody(template.htmlBody);
  }

  async function handleSave() {
    if (!editTemplate) return;
    setSaving(true);
    try {
      const res = await fetch(
        `/api/admin/crm/emails/templates/${editTemplate.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: editSubject,
            htmlBody: editBody,
          }),
        },
      );
      if (res.ok) {
        setEditTemplate(null);
        // Refresh page to get updated templates
        window.location.reload();
      }
    } catch {
      // Save failed
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emails</h1>
          <p className="mt-1 text-sm text-gray-500">
            Templates, historique et statistiques d&apos;envoi
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Send className="size-4" />
            Envoyés (30j)
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900">{stats.sent}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Eye className="size-4" />
            Ouverts (30j)
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {stats.opened}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <BarChart3 className="size-4" />
            Taux d&apos;ouverture
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {stats.openRate}%
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <AlertCircle className="size-4" />
            Échoués (30j)
          </div>
          <p className="mt-1 text-2xl font-bold text-red-600">
            {stats.failed}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="templates">
        <TabsList>
          <TabsTrigger value="templates" className="gap-1.5">
            <FileText className="size-4" />
            Templates ({templates.length})
          </TabsTrigger>
          <TabsTrigger value="historique" className="gap-1.5">
            <Mail className="size-4" />
            Historique ({totalLogs})
          </TabsTrigger>
        </TabsList>

        {/* ─── Templates Tab ─── */}
        <TabsContent value="templates">
          <div className="rounded-lg border border-gray-200 bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Nom</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead className="w-[120px]">Variables</TableHead>
                  <TableHead className="w-[80px]">Statut</TableHead>
                  <TableHead className="w-[140px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">
                      {TEMPLATE_LABELS[template.name as TemplateName] ??
                        template.name}
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate text-sm text-gray-600">
                      {template.subject}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-500">
                        {(template.variables as string[] | null)?.length ?? 0}{" "}
                        var.
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={template.active ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {template.active ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreview(template)}
                          className="text-xs"
                        >
                          <Eye className="mr-1 size-3" />
                          Preview
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(template)}
                          className="text-xs"
                        >
                          Modifier
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ─── Historique Tab ─── */}
        <TabsContent value="historique">
          <div className="rounded-lg border border-gray-200 bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Destinataire</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[100px]">Ouvertures</TableHead>
                  <TableHead className="w-[160px]">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialLogs.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-12 text-center text-sm text-gray-400"
                    >
                      Aucun email envoyé pour le moment
                    </TableCell>
                  </TableRow>
                )}
                {initialLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {log.lead?.name ?? log.to}
                        </p>
                        <p className="text-xs text-gray-500">{log.to}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate text-sm text-gray-600">
                      {log.subject}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={log.status} />
                    </TableCell>
                    <TableCell>
                      {log.openCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600">
                          <Eye className="size-3" />
                          {log.openCount}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(log.sentAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* ─── Preview Dialog ─── */}
      <Dialog
        open={!!previewTemplate}
        onOpenChange={() => setPreviewTemplate(null)}
      >
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Preview —{" "}
              {previewTemplate
                ? TEMPLATE_LABELS[previewTemplate.name as TemplateName] ??
                  previewTemplate.name
                : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {previewLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="size-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
              </div>
            ) : (
              <iframe
                srcDoc={previewHtml}
                className="h-[600px] w-full rounded border border-gray-200"
                title="Email preview"
                sandbox=""
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Edit Dialog ─── */}
      <Dialog open={!!editTemplate} onOpenChange={() => setEditTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Modifier —{" "}
              {editTemplate
                ? TEMPLATE_LABELS[editTemplate.name as TemplateName] ??
                  editTemplate.name
                : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 space-y-4 overflow-auto">
            {/* Subject */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Sujet
              </label>
              <input
                type="text"
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            {/* Body */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Corps HTML (body uniquement)
              </label>
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows={15}
                className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-xs focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            {/* Variables */}
            {editTemplate?.variables && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-500">
                  Variables disponibles
                </label>
                <div className="flex flex-wrap gap-1">
                  {(editTemplate.variables as string[]).map((v) => (
                    <code
                      key={v}
                      className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600"
                    >
                      {`{{${v}}}`}
                    </code>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-gray-200 pt-4">
            <Button
              variant="outline"
              onClick={() => setEditTemplate(null)}
              disabled={saving}
            >
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
