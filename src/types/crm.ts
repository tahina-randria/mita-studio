// Pipeline stages
export const PIPELINE_STAGES = [
  "NEW",
  "CONTACTED",
  "CALL_BOOKED",
  "CALL_DONE",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "WON",
  "LOST",
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export const STAGE_LABELS: Record<PipelineStage, string> = {
  NEW: "Nouveau",
  CONTACTED: "Contacté",
  CALL_BOOKED: "Appel planifié",
  CALL_DONE: "Appel fait",
  PROPOSAL_SENT: "Devis envoyé",
  NEGOTIATION: "Négociation",
  WON: "Gagné",
  LOST: "Perdu",
};

export const STAGE_COLORS: Record<PipelineStage, string> = {
  NEW: "bg-blue-500",
  CONTACTED: "bg-indigo-500",
  CALL_BOOKED: "bg-purple-500",
  CALL_DONE: "bg-amber-500",
  PROPOSAL_SENT: "bg-orange-500",
  NEGOTIATION: "bg-yellow-500",
  WON: "bg-emerald-500",
  LOST: "bg-red-500",
};

export const STAGE_TEXT_COLORS: Record<PipelineStage, string> = {
  NEW: "text-blue-700 bg-blue-50",
  CONTACTED: "text-indigo-700 bg-indigo-50",
  CALL_BOOKED: "text-purple-700 bg-purple-50",
  CALL_DONE: "text-amber-700 bg-amber-50",
  PROPOSAL_SENT: "text-orange-700 bg-orange-50",
  NEGOTIATION: "text-yellow-700 bg-yellow-50",
  WON: "text-emerald-700 bg-emerald-50",
  LOST: "text-red-700 bg-red-50",
};

// Score breakdown
export interface ScoreBreakdown {
  budget: number;
  service: number;
  urgency: number;
  engagement: number;
  company: number;
}

// Lead activity types
export const ACTIVITY_TYPES = [
  "stage_change",
  "email_sent",
  "email_opened",
  "note_added",
  "call_scheduled",
  "call_done",
  "no_show",
  "proposal_sent",
  "proposal_viewed",
  "score_update",
  "auto_relance",
] as const;

export type LeadActivityType = (typeof ACTIVITY_TYPES)[number];

// Call results
export const CALL_RESULTS = [
  "good_fit",
  "medium_fit",
  "bad_fit",
  "no_show",
] as const;

export type CallResult = (typeof CALL_RESULTS)[number];

export const CALL_RESULT_LABELS: Record<CallResult, string> = {
  good_fit: "Bon fit",
  medium_fit: "Fit moyen",
  bad_fit: "Mauvais fit",
  no_show: "No-show",
};

export const CALL_RESULT_COLORS: Record<CallResult, string> = {
  good_fit: "text-emerald-700 bg-emerald-50",
  medium_fit: "text-amber-700 bg-amber-50",
  bad_fit: "text-red-700 bg-red-50",
  no_show: "text-gray-700 bg-gray-50",
};

// CRM Task types (per-lead scheduled tasks)
export const CRM_TASK_TYPES = [
  "call_reminder_24h",
  "call_reminder_1h",
  "call_brief_prep",
  "call_followup_check",
  "no_show_check",
  "draft_proposal_reminder",
] as const;

export type CrmTaskType = (typeof CRM_TASK_TYPES)[number];

export const CRM_TASK_LABELS: Record<CrmTaskType, string> = {
  call_reminder_24h: "Rappel appel (24h)",
  call_reminder_1h: "Rappel appel (1h)",
  call_brief_prep: "Brief pré-appel",
  call_followup_check: "Vérification suivi",
  no_show_check: "Vérification no-show",
  draft_proposal_reminder: "Rappel devis",
};

// CRM Task statuses
export const CRM_TASK_STATUSES = [
  "pending",
  "completed",
  "cancelled",
  "failed",
] as const;

export type CrmTaskStatus = (typeof CRM_TASK_STATUSES)[number];

// Lost reasons
export const LOST_REASONS = [
  { value: "budget", label: "Budget insuffisant" },
  { value: "timing", label: "Pas le bon moment" },
  { value: "competitor", label: "Choisi un concurrent" },
  { value: "no_response", label: "Sans réponse" },
  { value: "other", label: "Autre" },
] as const;

export type LostReason = (typeof LOST_REASONS)[number]["value"];

// Proposal status
export const PROPOSAL_STATUSES = [
  "draft",
  "sent",
  "viewed",
  "accepted",
  "rejected",
  "expired",
] as const;

export type ProposalStatus = (typeof PROPOSAL_STATUSES)[number];

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

export const TEMPLATE_NAMES = [
  "accuse_reception",
  "premier_contact",
  "relance_j3",
  "relance_j5",
  "relance_j7",
  "confirmation_appel",
  "rappel_appel",
  "no_show",
  "recap_appel",
  "envoi_devis",
  "relance_devis_non_lu",
  "relance_devis_lu",
  "bienvenue_client",
  "lead_perdu",
  "template_libre",
  "rappel_appel_24h",
  "merci_post_appel",
] as const;

export type TemplateName = (typeof TEMPLATE_NAMES)[number];

export const TEMPLATE_LABELS: Record<TemplateName, string> = {
  accuse_reception: "Accusé de réception",
  premier_contact: "Premier contact",
  relance_j3: "Relance J+3",
  relance_j5: "Relance J+5",
  relance_j7: "Relance J+7",
  confirmation_appel: "Confirmation appel",
  rappel_appel: "Rappel appel",
  no_show: "No-show",
  recap_appel: "Récapitulatif appel",
  envoi_devis: "Envoi devis",
  relance_devis_non_lu: "Relance devis (non lu)",
  relance_devis_lu: "Relance devis (lu)",
  bienvenue_client: "Bienvenue client",
  lead_perdu: "Lead perdu",
  template_libre: "Template libre",
  rappel_appel_24h: "Rappel appel (24h avant)",
  merci_post_appel: "Merci post-appel",
};

// ============================================================================
// EMAIL STATUSES
// ============================================================================

export const EMAIL_STATUSES = [
  "sending",
  "sent",
  "failed",
  "bounced",
  "delivered",
] as const;

export type EmailStatus = (typeof EMAIL_STATUSES)[number];

export const EMAIL_STATUS_LABELS: Record<EmailStatus, string> = {
  sending: "En cours",
  sent: "Envoyé",
  failed: "Échoué",
  bounced: "Rebondi",
  delivered: "Délivré",
};

export const EMAIL_STATUS_COLORS: Record<EmailStatus, string> = {
  sending: "text-blue-700 bg-blue-50",
  sent: "text-emerald-700 bg-emerald-50",
  failed: "text-red-700 bg-red-50",
  bounced: "text-orange-700 bg-orange-50",
  delivered: "text-green-700 bg-green-50",
};
