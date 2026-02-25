import type { Metadata } from "next";
import { ServicePageLayout } from "../_components/ServicePageLayout";

export const metadata: Metadata = {
  title: "Cr\u00e9ation de sites web",
  description:
    "Sites web sur mesure, performants et optimis\u00e9s SEO. Livr\u00e9 en 2 semaines par Mita Studio. \u00c0 partir de 790\u00a0\u20ac.",
  alternates: { canonical: "/web" },
  openGraph: {
    title: "Cr\u00e9ation de sites web | Mita Studio",
    description:
      "Sites web sur mesure, performants et optimis\u00e9s SEO. Livr\u00e9 en 2 semaines. \u00c0 partir de 790\u00a0\u20ac.",
    url: "https://mita-studio.com/web",
    type: "website",
    locale: "fr_FR",
    siteName: "Mita Studio",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Mita Studio" }],
  },
};

const FEATURES = [
  {
    icon: "\ud83c\udfa8",
    title: "Design sur mesure",
    description:
      "Interface unique align\u00e9e avec votre identit\u00e9 de marque",
  },
  {
    icon: "\u26a1",
    title: "Performance maximale",
    description:
      "Sites rapides, score Lighthouse 95+",
  },
  {
    icon: "\ud83d\udcf1",
    title: "Responsive parfait",
    description:
      "Adapt\u00e9 \u00e0 tous les \u00e9crans et appareils",
  },
  {
    icon: "\ud83d\udd0d",
    title: "SEO natif",
    description:
      "Structure optimis\u00e9e pour le r\u00e9f\u00e9rencement d\u00e8s la conception",
  },
];

const PROCESS = [
  {
    number: "01",
    title: "D\u00e9couverte",
    description:
      "Analyse de vos besoins, objectifs et audience cible",
  },
  {
    number: "02",
    title: "Design",
    description:
      "Maquettes interactives et validation du design",
  },
  {
    number: "03",
    title: "D\u00e9veloppement",
    description:
      "Code propre, performant, Next.js + Tailwind",
  },
  {
    number: "04",
    title: "Lancement",
    description:
      "Mise en production, tests et suivi post-lancement",
  },
];

const FAQS = [
  {
    question: "Combien de temps pour cr\u00e9er un site ?",
    answer:
      "En moyenne 4 \u00e0 8 semaines selon la complexit\u00e9. Sites vitrines plus rapides, e-commerce ou applications plus longs.",
  },
  {
    question: "Quelles technologies utilisez-vous ?",
    answer:
      "Next.js, React, Tailwind CSS, TypeScript. H\u00e9bergement sur Vercel pour des performances optimales.",
  },
  {
    question: "Le site sera-t-il optimis\u00e9 pour le SEO ?",
    answer:
      "Absolument. Nous int\u00e9grons les bonnes pratiques SEO d\u00e8s la conception : structure s\u00e9mantique, meta tags, sitemap, performance.",
  },
  {
    question: "Proposez-vous la maintenance ?",
    answer:
      "Oui, nous proposons un suivi post-lancement incluant mises \u00e0 jour, corrections et optimisations continues.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Cr\u00e9ation de sites web",
  description:
    "Sites web sur mesure, performants et optimis\u00e9s SEO pour ind\u00e9pendants et PME.",
  provider: {
    "@type": "Organization",
    name: "Mita Studio",
    url: "https://mita-studio.com",
  },
  areaServed: "FR",
  url: "https://mita-studio.com/web",
  offers: {
    "@type": "Offer",
    price: "790",
    priceCurrency: "EUR",
    description: "\u00c0 partir de 790\u00a0\u20ac",
  },
};

export default function WebPage() {
  return (
    <ServicePageLayout
      title="Création de sites web"
      subtitle="Web Development"
      description="Sites web sur mesure, performants et optimis&eacute;s SEO. Livr&eacute; en 2 semaines, &agrave; partir de 790&nbsp;&euro;."
      features={FEATURES}
      process={PROCESS}
      faqs={FAQS}
      ctaText="Nous contacter"
      jsonLd={JSON_LD}
    />
  );
}
