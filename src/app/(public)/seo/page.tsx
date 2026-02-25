import type { Metadata } from "next";
import { ServicePageLayout } from "../_components/ServicePageLayout";

export const metadata: Metadata = {
  title: "SEO / R\u00e9f\u00e9rencement",
  description:
    "Strat\u00e9gie SEO compl\u00e8te pour am\u00e9liorer votre visibilit\u00e9 sur Google. Audit, optimisation et suivi par Mita Studio.",
  alternates: { canonical: "/seo" },
  openGraph: {
    title: "SEO / R\u00e9f\u00e9rencement | Mita Studio",
    description:
      "Strat\u00e9gie SEO compl\u00e8te pour am\u00e9liorer votre visibilit\u00e9 sur Google. Audit, optimisation et suivi.",
    url: "https://mita-studio.com/seo",
    type: "website",
    locale: "fr_FR",
    siteName: "Mita Studio",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Mita Studio" }],
  },
};

const FEATURES = [
  {
    icon: "\ud83d\udcca",
    title: "Audit SEO complet",
    description:
      "Analyse technique, contenu et backlinks de votre site",
  },
  {
    icon: "\ud83c\udfaf",
    title: "Strat\u00e9gie de mots-cl\u00e9s",
    description:
      "Recherche et ciblage des requ\u00eates \u00e0 fort potentiel",
  },
  {
    icon: "\u270d\ufe0f",
    title: "Optimisation de contenu",
    description:
      "R\u00e9daction et restructuration pour le r\u00e9f\u00e9rencement",
  },
  {
    icon: "\ud83d\udcc8",
    title: "Suivi et reporting",
    description:
      "Tableaux de bord et rapports mensuels de performance",
  },
];

const PROCESS = [
  {
    number: "01",
    title: "Audit",
    description:
      "Analyse compl\u00e8te de votre pr\u00e9sence en ligne actuelle",
  },
  {
    number: "02",
    title: "Strat\u00e9gie",
    description:
      "Plan d\u2019action personnalis\u00e9 bas\u00e9 sur vos objectifs",
  },
  {
    number: "03",
    title: "Optimisation",
    description:
      "Mise en \u0153uvre des am\u00e9liorations techniques et de contenu",
  },
  {
    number: "04",
    title: "Suivi",
    description:
      "Monitoring continu et ajustements strat\u00e9giques",
  },
];

const FAQS = [
  {
    question: "Combien de temps pour voir des r\u00e9sultats SEO ?",
    answer:
      "Le SEO est un investissement long terme. Les premiers r\u00e9sultats apparaissent g\u00e9n\u00e9ralement entre 3 et 6 mois.",
  },
  {
    question: "Garantissez-vous la premi\u00e8re position Google ?",
    answer:
      "Non, personne ne peut garantir une position. Nous optimisons selon les meilleures pratiques pour maximiser vos chances.",
  },
  {
    question: "Travaillez-vous sur le SEO local ?",
    answer:
      "Oui, nous optimisons votre pr\u00e9sence locale : Google Business Profile, citations, avis et contenu g\u00e9olocalis\u00e9.",
  },
  {
    question: "Quels outils utilisez-vous ?",
    answer:
      "Semrush, Google Search Console, Google Analytics, Ahrefs et des outils propri\u00e9taires pour l\u2019analyse et le suivi.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "SEO / R\u00e9f\u00e9rencement",
  description:
    "Strat\u00e9gie SEO compl\u00e8te : audit, optimisation de contenu et suivi de positions pour une visibilit\u00e9 durable sur Google.",
  provider: {
    "@type": "Organization",
    name: "Mita Studio",
    url: "https://mita-studio.com",
  },
  areaServed: "FR",
  url: "https://mita-studio.com/seo",
};

export default function SeoPage() {
  return (
    <ServicePageLayout
      title="SEO / Référencement"
      subtitle="Search Engine Optimization"
      description="Stratégie SEO complète pour améliorer votre visibilité sur Google. Audit, optimisation et suivi de performance pour des résultats durables."
      features={FEATURES}
      process={PROCESS}
      faqs={FAQS}
      ctaText="Nous contacter"
      jsonLd={JSON_LD}
    />
  );
}
