import type { Metadata } from "next";
import { ServicePageLayout } from "../_components/ServicePageLayout";

export const metadata: Metadata = {
  title: "Audit & Digitalisation",
  description:
    "Audit digital complet et accompagnement \u00e0 la transformation num\u00e9rique de votre entreprise par Mita Studio.",
  alternates: { canonical: "/audit" },
  openGraph: {
    title: "Audit & Digitalisation | Mita Studio",
    description:
      "Audit digital complet et accompagnement \u00e0 la transformation num\u00e9rique de votre entreprise.",
    url: "https://mita-studio.com/audit",
    type: "website",
    locale: "fr_FR",
    siteName: "Mita Studio",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Mita Studio" }],
  },
};

const FEATURES = [
  {
    icon: "🔎",
    title: "Diagnostic complet",
    description:
      "Analyse de votre présence digitale actuelle",
  },
  {
    icon: "📋",
    title: "Plan d'action",
    description:
      "Recommandations prioritaires et feuille de route",
  },
  {
    icon: "🔧",
    title: "Accompagnement",
    description:
      "Support dans la mise en œuvre des améliorations",
  },
  {
    icon: "📊",
    title: "Mesure d'impact",
    description:
      "KPIs et suivi des résultats post-audit",
  },
];

const PROCESS = [
  {
    number: "01",
    title: "État des lieux",
    description:
      "Cartographie complète de votre écosystème digital",
  },
  {
    number: "02",
    title: "Analyse",
    description:
      "Identification des forces, faiblesses et opportunités",
  },
  {
    number: "03",
    title: "Recommandations",
    description:
      "Rapport détaillé avec actions prioritaires",
  },
  {
    number: "04",
    title: "Accompagnement",
    description:
      "Support dans l'exécution et mesure des résultats",
  },
];

const FAQS = [
  {
    question: "Que couvre l'audit digital ?",
    answer:
      "L'audit analyse votre site web, votre référencement, vos réseaux sociaux, vos outils internes et votre stratégie digitale globale.",
  },
  {
    question: "Combien de temps dure un audit ?",
    answer:
      "Un audit complet prend généralement 2 à 3 semaines, incluant l'analyse, les recommandations et la présentation.",
  },
  {
    question: "L'audit est-il adapté aux petites entreprises ?",
    answer:
      "Absolument. Nous adaptons la profondeur de l'audit à la taille et aux besoins de votre structure.",
  },
  {
    question: "Accompagnez-vous la mise en œuvre ?",
    answer:
      "Oui, nous proposons un accompagnement post-audit pour vous aider à implémenter les recommandations.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Audit & Digitalisation",
  description:
    "Audit digital complet : diagnostic, recommandations et accompagnement \u00e0 la transformation num\u00e9rique.",
  provider: {
    "@type": "Organization",
    name: "Mita Studio",
    url: "https://mita-studio.com",
  },
  areaServed: "FR",
  url: "https://mita-studio.com/audit",
};

export default function AuditPage() {
  return (
    <ServicePageLayout
      title="Audit & Digitalisation"
      subtitle="Digital Transformation"
      description="Audit digital complet et accompagnement à la transformation numérique de votre entreprise. Diagnostic, recommandations et support dans la mise en œuvre."
      features={FEATURES}
      process={PROCESS}
      faqs={FAQS}
      ctaText="Nous contacter"
      jsonLd={JSON_LD}
    />
  );
}
