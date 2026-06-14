import type { Metadata } from "next";
import Script from "next/script";

import { LazySpectralBackground } from "./_components/LazySpectralBackground";
import { StudioHeader } from "./_components/StudioHeader";
import { StudioHeroSection } from "./_components/StudioHeroSection";
import { ProblemSection } from "./_components/ProblemSection";
import { ServicesSection } from "./_components/ServicesSection";
import { ProcessSection } from "./_components/ProcessSection";
import { StudioPricingSection } from "./_components/StudioPricingSection";
import { ClientTestimonialsSection } from "./_components/ClientTestimonialsSection";
import { CommitmentsSection } from "./_components/CommitmentsSection";
import { HomeFAQSection } from "./_components/HomeFAQSection";
import { StudioAboutSection } from "./_components/StudioAboutSection";
import { StudioCTASection } from "./_components/StudioCTASection";
import { StudioFooter } from "./_components/StudioFooter";
import { StickyMobileCTA } from "./_components/StickyMobileCTA";

import {
  getServices,
  getPricingTiers,
  getTestimonials,
  getTeaserQuotes,
  getCommitments,
  getProblems,
  getFaqItems,
  getSiteContent,
  getNavItems,
  getSiteSettings,
} from "@/lib/queries";

export const metadata: Metadata = {
  title: "Mita Studio \u2014 Le digital pro, enfin accessible",
  description:
    "Site web, r\u00e9f\u00e9rencement Google et outils digitaux sur mesure. Livr\u00e9s en 1 \u00e0 3\u00a0semaines. \u00c0 partir de 890\u00a0\u20ac.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Mita Studio \u2014 Le digital pro, enfin accessible",
    description:
      "Site web, r\u00e9f\u00e9rencement Google et outils digitaux sur mesure. Livr\u00e9s en 1 \u00e0 3\u00a0semaines.",
    url: "https://mita-studio.com",
    type: "website",
    locale: "fr_FR",
    siteName: "Mita Studio",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Mita Studio" }],
  },
};

export default async function HomePage() {
  const [
    services,
    pricingTiers,
    subscriptionTiers,
    testimonials,
    teaserQuotes,
    commitments,
    problems,
    faqItems,
    heroContent,
    aboutContent,
    ctaContent,
    headerNavItems,
    footerStudioLinks,
    footerLegalLinks,
    contactSettings,
    socialSettings,
    generalSettings,
  ] = await Promise.all([
    getServices(),
    getPricingTiers("oneshot"),
    getPricingTiers("subscription"),
    getTestimonials(),
    getTeaserQuotes(),
    getCommitments(),
    getProblems(),
    getFaqItems(),
    getSiteContent("hero"),
    getSiteContent("about"),
    getSiteContent("cta"),
    getNavItems("header"),
    getNavItems("footer_studio"),
    getNavItems("footer_legal"),
    getSiteSettings("contact"),
    getSiteSettings("social"),
    getSiteSettings("general"),
  ]);

  const settings = { ...generalSettings, ...contactSettings, ...socialSettings };

  // Build JSON-LD from DB data
  const jsonLdOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.company_name || "Mita Studio",
    url: "https://mita-studio.com",
    logo: "https://mita-studio.com/logo.webp",
    founder: { "@type": "Person", name: "Tahina Randrianandraina" },
    contactPoint: {
      "@type": "ContactPoint",
      email: settings.email || "tahina@mita-studio.com",
      contactType: "customer service",
      availableLanguage: "French",
    },
  };

  const jsonLdWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.company_name || "Mita Studio",
    url: "https://mita-studio.com",
    description: settings.tagline || "Le digital pro, enfin accessible.",
    inLanguage: "fr",
  };

  const jsonLdServices = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.title,
        description: s.description,
        provider: { "@type": "Organization", name: settings.company_name || "Mita Studio" },
        areaServed: "FR",
      },
    })),
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <div className="studio-page min-h-screen bg-[#050a1e] text-white">
      <a href="#main" className="skip-link">
        Aller au contenu principal
      </a>
      <LazySpectralBackground />
      <Script
        id="json-ld-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
      />
      <Script
        id="json-ld-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
      />
      <Script
        id="json-ld-services"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdServices) }}
      />
      <Script
        id="json-ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      <StudioHeader navLinks={headerNavItems} />
      <main id="main" className="relative" style={{ zIndex: 1 }}>
        <StudioHeroSection content={heroContent} />
        <ServicesSection services={services} />
        <ProblemSection problems={problems} />
        <ProcessSection />
        <StudioPricingSection
          pricingTiers={pricingTiers}
          subscriptionTiers={subscriptionTiers}
        />
        <ClientTestimonialsSection
          testimonials={testimonials}
          teaserQuotes={teaserQuotes}
        />
        <CommitmentsSection commitments={commitments} />
        <HomeFAQSection faqs={faqItems} />
        <StudioAboutSection content={aboutContent} />
        <StudioCTASection content={ctaContent} settings={settings} />
      </main>
      <StudioFooter
        studioLinks={footerStudioLinks}
        legalLinks={footerLegalLinks}
        settings={settings}
      />
      <StickyMobileCTA />
    </div>
  );
}
