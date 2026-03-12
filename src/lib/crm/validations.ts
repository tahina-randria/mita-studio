import { z } from "zod/v4";
import { PIPELINE_STAGES, EMAIL_STATUSES, CALL_RESULTS } from "@/types/crm";

// Login
export const loginSchema = z.object({
  email: z.email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

// Update lead
export const updateLeadSchema = z.object({
  stage: z.enum(PIPELINE_STAGES).optional(),
  dealValue: z.number().int().min(0).optional(),
  lostReason: z
    .enum(["budget", "timing", "competitor", "no_response", "other"])
    .optional(),
  assignedTo: z.string().optional().nullable(),
  nextFollowUpAt: z.string().datetime().optional().nullable(),
  isNoShow: z.boolean().optional(),
  lastContactedAt: z.string().datetime().optional().nullable(),
});

// Create note
export const createNoteSchema = z.object({
  content: z.string().min(1, "Le contenu est requis"),
  pinned: z.boolean().optional(),
});

// Leads list query params
export const leadsQuerySchema = z.object({
  search: z.string().optional(),
  stage: z.enum(PIPELINE_STAGES).optional(),
  sortBy: z.enum(["createdAt", "score", "name", "updatedAt"]).optional(),
  sortDir: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

// ============================================================================
// EMAIL SCHEMAS
// ============================================================================

// Send email
export const sendEmailSchema = z.object({
  templateId: z.string().min(1, "Template requis"),
  leadId: z.string().min(1, "Lead requis"),
  customSubject: z.string().optional(),
  customHtml: z.string().optional(),
});

// Update template
export const updateTemplateSchema = z.object({
  subject: z.string().min(1).optional(),
  htmlBody: z.string().min(1).optional(),
  textBody: z.string().optional().nullable(),
  active: z.boolean().optional(),
});

// Email logs query
export const emailLogQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  status: z.enum(EMAIL_STATUSES).optional(),
  leadId: z.string().optional(),
});

// Email preview
export const emailPreviewSchema = z.object({
  templateId: z.string().min(1, "Template requis"),
  leadId: z.string().optional(),
  variables: z.record(z.string(), z.string()).optional(),
});

// ============================================================================
// CALL SCHEMAS (Week 3)
// ============================================================================

// Complete a call
export const callCompleteSchema = z.object({
  callResult: z.enum(CALL_RESULTS),
  callDurationMinutes: z.number().int().min(1).optional(),
  callNotes: z.string().optional(),
  callBudgetDiscussed: z.boolean().optional(),
  callUrgencyDiscussed: z.boolean().optional(),
  callIsDecisionMaker: z.boolean().optional(),
  callFeaturesNeeded: z.array(z.string()).optional(),
  callNextAction: z.string().optional(),
  callProposalDeadline: z.string().datetime().optional(),
  callEstimatedAmountCents: z.number().int().min(0).optional(),
  sendRecapEmail: z.boolean().optional(),
  recapContent: z.string().optional(),
});

// No-show a call
export const callNoShowSchema = z.object({
  sendRescheduleEmail: z.boolean().optional(),
});

// Calendar query
export const calendarQuerySchema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime(),
});
