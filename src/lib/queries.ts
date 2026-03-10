import { prisma } from "@/lib/db";
import { cache } from "react";

// ============================================================================
// SERVICES
// ============================================================================

export const getServices = cache(() =>
  prisma.service.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, title: true, description: true, iconUrl: true },
  })
);

// ============================================================================
// PRICING
// ============================================================================

export const getPricingTiers = cache((type: "oneshot" | "subscription") =>
  prisma.pricingTier.findMany({
    where: { active: true, type },
    orderBy: { sortOrder: "asc" },
    include: {
      features: {
        orderBy: { sortOrder: "asc" },
        select: { id: true, text: true, included: true },
      },
    },
  })
);

// ============================================================================
// TESTIMONIALS & TEASER QUOTES
// ============================================================================

export const getTestimonials = cache(() =>
  prisma.testimonial.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      quote: true,
      name: true,
      role: true,
      company: true,
      initials: true,
      accentColor: true,
    },
  })
);

export const getTeaserQuotes = cache(() =>
  prisma.teaserQuote.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, text: true },
  })
);

// ============================================================================
// COMMITMENTS
// ============================================================================

export const getCommitments = cache(() =>
  prisma.commitment.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, title: true, description: true, iconUrl: true },
  })
);

// ============================================================================
// PROBLEMS
// ============================================================================

export const getProblems = cache(() =>
  prisma.problem.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, stat: true, title: true, description: true, iconUrl: true },
  })
);

// ============================================================================
// FAQ
// ============================================================================

export const getFaqItems = cache((category?: string) =>
  prisma.faqItem.findMany({
    where: { active: true, ...(category ? { category } : {}) },
    orderBy: { sortOrder: "asc" },
    select: { id: true, question: true, answer: true },
  })
);

// ============================================================================
// SITE CONTENT (hero, about, cta sections)
// ============================================================================

export const getSiteContent = cache(async (section: string) => {
  const rows = await prisma.siteContent.findMany({
    where: { section },
    select: { key: true, value: true },
  });
  return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, string>;
});

// ============================================================================
// NAVIGATION
// ============================================================================

export const getNavItems = cache((location: string) =>
  prisma.navItem.findMany({
    where: { active: true, location },
    orderBy: { sortOrder: "asc" },
    select: { id: true, label: true, href: true, external: true },
  })
);

// ============================================================================
// SITE SETTINGS
// ============================================================================

export const getSiteSettings = cache(async (group?: string) => {
  const rows = await prisma.siteSetting.findMany({
    where: group ? { group } : {},
    select: { key: true, value: true },
  });
  return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, string>;
});
