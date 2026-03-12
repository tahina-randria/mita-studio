import type { ScoreBreakdown } from "@/types/crm";

// Budget scoring map
const BUDGET_SCORES: Record<string, number> = {
  "< 1 000 €": 10,
  "1 000 - 2 500 €": 20,
  "2 500 - 5 000 €": 30,
  "5 000+ €": 40,
  "pas encore défini": 15,
};

// Service scoring map
const SERVICE_SCORES: Record<string, number> = {
  "site-web": 15,
  seo: 20,
  "outil-digital": 25,
  "pack-complet": 30,
  autre: 10,
};

// Urgency keywords (French)
const URGENCY_KEYWORDS = [
  "urgent",
  "rapidement",
  "vite",
  "pressé",
  "presse",
  "deadline",
  "asap",
  "demain",
  "dès que possible",
  "au plus vite",
  "le plus tôt",
  "immédiat",
  "immediatement",
  "dans les plus brefs",
];

interface ContactFormData {
  budget?: string | null;
  service?: string | null;
  message: string;
  phone?: string | null;
  company?: string | null;
}

/**
 * Calculate lead score from contact form data.
 * Returns a score (0-100) and the detailed breakdown.
 */
export function calculateLeadScore(data: ContactFormData): {
  score: number;
  breakdown: ScoreBreakdown;
} {
  const breakdown: ScoreBreakdown = {
    budget: 0,
    service: 0,
    urgency: 0,
    engagement: 0,
    company: 0,
  };

  // Budget score
  breakdown.budget = data.budget ? (BUDGET_SCORES[data.budget] ?? 15) : 15;

  // Service score
  breakdown.service = data.service ? (SERVICE_SCORES[data.service] ?? 10) : 10;

  // Urgency NLP (simple keyword matching on message)
  const messageLower = data.message.toLowerCase();
  const hasUrgency = URGENCY_KEYWORDS.some((kw) => messageLower.includes(kw));
  breakdown.urgency = hasUrgency ? 15 : 0;

  // Engagement signals
  if (data.phone && data.phone.trim().length > 0) {
    breakdown.engagement += 10;
  }

  // Company
  if (data.company && data.company.trim().length > 0) {
    breakdown.company = 5;
  }

  // Total (capped at 100)
  const score = Math.min(
    100,
    breakdown.budget +
      breakdown.service +
      breakdown.urgency +
      breakdown.engagement +
      breakdown.company
  );

  return { score, breakdown };
}
