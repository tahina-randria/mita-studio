import type { Metadata } from "next";
import Script from "next/script";

import { LazySpectralBackground } from "./_components/LazySpectralBackground";

export const metadata: Metadata = {
  title: "Mita Studio \u2014 Le digital pro, enfin accessible",
  description:
    "Site web, r\u00e9f\u00e9rencement Google et outils digitaux sur mesure. Livr\u00e9s en 2\u00a0semaines. \u00c0 partir de 790\u00a0\u20ac.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Mita Studio \u2014 Le digital pro, enfin accessible",
    description:
      "Site web, r\u00e9f\u00e9rencement Google et outils digitaux sur mesure. Livr\u00e9s en 2\u00a0semaines.",
    url: "https://mita-studio.com",
    type: "website",
    locale: "fr_FR",
    siteName: "Mita Studio",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Mita Studio" }],
  },
};
import { StudioHeader } from "./_components/StudioHeader";
import { StudioHeroSection } from "./_components/StudioHeroSection";
import { ProblemSection } from "./_components/ProblemSection";
import { ServicesSection } from "./_components/ServicesSection";
import { ProcessSection } from "./_components/ProcessSection";
import { StudioPricingSection } from "./_components/StudioPricingSection";
import { ClientTestimonialsSection } from "./_components/ClientTestimonialsSection";
import { CommitmentsSection } from "./_components/TestimonialsSection";
import { HomeFAQSection } from "./_components/HomeFAQSection";
import { StudioAboutSection } from "./_components/StudioAboutSection";
import { StudioCTASection } from "./_components/StudioCTASection";
import { StudioFooter } from "./_components/StudioFooter";
import { StickyMobileCTA } from "./_components/StickyMobileCTA";

const JSON_LD_ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mita Studio",
  url: "https://mita-studio.com",
  logo: "https://mita-studio.com/logo.webp",
  founder: {
    "@type": "Person",
    name: "Tahina Randrianandraina",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "tahina@mita-studio.com",
    contactType: "customer service",
    availableLanguage: "French",
  },
};

const JSON_LD_WEBSITE = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Mita Studio",
  url: "https://mita-studio.com",
  description:
    "Le digital pro, enfin accessible. Sites web, SEO et automatisation propuls\u00e9s par l\u2019IA pour les ind\u00e9pendants et PME.",
  inLanguage: "fr",
};

const JSON_LD_SERVICES = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Service",
        name: "Cr\u00e9ation de site web",
        description: "Sites vitrines, e-commerce et applications web sur mesure. Design soign\u00e9, rapide, optimis\u00e9 pour convertir.",
        provider: { "@type": "Organization", name: "Mita Studio" },
        areaServed: "FR",
        offers: { "@type": "Offer", price: "790", priceCurrency: "EUR", priceSpecification: { "@type": "UnitPriceSpecification", price: "790", priceCurrency: "EUR", unitText: "projet" } },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Service",
        name: "R\u00e9f\u00e9rencement SEO",
        description: "Strat\u00e9gie SEO compl\u00e8te et multilingue. Contenu optimis\u00e9, suivi de positions pour une visibilit\u00e9 durable.",
        provider: { "@type": "Organization", name: "Mita Studio" },
        areaServed: "FR",
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Service",
        name: "Outils digitaux sur mesure",
        description: "Outils sur mesure pour automatiser vos t\u00e2ches r\u00e9p\u00e9titives.",
        provider: { "@type": "Organization", name: "Mita Studio" },
        areaServed: "FR",
      },
    },
  ],
};

const JSON_LD_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Combien de temps faut-il pour cr\u00e9er un site\u00a0?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En moyenne 2 \u00e0 4 semaines, selon la complexit\u00e9 du projet. Un site vitrine simple peut \u00eatre livr\u00e9 en 10 jours.",
      },
    },
    {
      "@type": "Question",
      name: "Quels sont vos tarifs\u00a0?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "\u00c0 partir de 790\u00a0\u20ac TTC pour un site vitrine (offre de lancement). Le tarif d\u00e9pend du nombre de pages et des fonctionnalit\u00e9s. Chaque devis est d\u00e9finitif.",
      },
    },
    {
      "@type": "Question",
      name: "Est-ce que le r\u00e9f\u00e9rencement Google est inclus\u00a0?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le r\u00e9f\u00e9rencement (ou SEO) d\u00e9signe l\u2019ensemble des techniques pour que votre site apparaisse dans les premiers r\u00e9sultats Google. Oui, chaque site inclut une optimisation de base. Pour aller plus loin, on propose un accompagnement d\u00e9di\u00e9.",
      },
    },
    {
      "@type": "Question",
      name: "Que se passe-t-il apr\u00e8s la livraison\u00a0?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Vous b\u00e9n\u00e9ficiez d\u2019un support post-lancement inclus. On reste disponible pour les ajustements et la formation.",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <div className="studio-page min-h-screen bg-[#050a1e] text-white">
      <a href="#main" className="skip-link">
        Aller au contenu principal
      </a>
      <LazySpectralBackground />
      <Script
        id="json-ld-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(JSON_LD_ORGANIZATION),
        }}
      />
      <Script
        id="json-ld-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_WEBSITE) }}
      />

      <Script
        id="json-ld-services"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_SERVICES) }}
      />
      <Script
        id="json-ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_FAQ) }}
      />

      <StudioHeader />
      <main id="main" className="relative" style={{ zIndex: 1 }}>
        <StudioHeroSection />
        <ServicesSection />
        <ProblemSection />
        <ProcessSection />
        <StudioPricingSection />
        <ClientTestimonialsSection />
        <CommitmentsSection />
        <HomeFAQSection />
        <StudioAboutSection />
        <StudioCTASection />
      </main>
      <StudioFooter />
      <StickyMobileCTA />
    </div>
  );
}
