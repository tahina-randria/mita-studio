import type { Metadata } from "next";
import { ServicePageLayout } from "../_components/ServicePageLayout";

export const metadata: Metadata = {
  title: "UGC Ads IA",
  description:
    "Publicit\u00e9s UGC g\u00e9n\u00e9r\u00e9es par IA avec Kling 3.0. Vid\u00e9os authentiques qui convertissent, sans tournage ni acteurs.",
  alternates: { canonical: "/ugc-ads" },
  openGraph: {
    title: "UGC Ads IA | Mita Studio",
    description:
      "Publicit\u00e9s UGC g\u00e9n\u00e9r\u00e9es par IA. Vid\u00e9os authentiques qui convertissent, sans tournage ni acteurs.",
    url: "https://mita-studio.com/ugc-ads",
    type: "website",
    locale: "fr_FR",
    siteName: "Mita Studio",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Mita Studio" }],
  },
};

const FEATURES = [
  {
    icon: "🤖",
    title: "IA Kling 3.0",
    description:
      "Génération vidéo ultra-réaliste de nouvelle génération",
  },
  {
    icon: "🎬",
    title: "Sans tournage",
    description:
      "Pas d'acteurs, pas de studio, production 100% IA",
  },
  {
    icon: "📱",
    title: "Format natif",
    description:
      "Vidéos optimisées pour TikTok, Instagram, Meta Ads",
  },
  {
    icon: "💰",
    title: "ROI maximisé",
    description:
      "Coût de production divisé par 10, itérations rapides",
  },
];

const PROCESS = [
  {
    number: "01",
    title: "Brief créatif",
    description:
      "Définition du message, cible et ton de la campagne",
  },
  {
    number: "02",
    title: "Génération IA",
    description:
      "Création des vidéos UGC avec Kling 3.0",
  },
  {
    number: "03",
    title: "Post-production",
    description:
      "Montage, sous-titrage et optimisation format",
  },
  {
    number: "04",
    title: "Livraison",
    description:
      "Fichiers prêts à diffuser sur vos plateformes",
  },
];

const FAQS = [
  {
    question: "Les vidéos IA sont-elles vraiment réalistes ?",
    answer:
      "Avec Kling 3.0, les résultats sont bluffants. Les vidéos sont souvent indiscernables de vrais UGC filmés par de vrais créateurs.",
  },
  {
    question: "Combien de vidéos puis-je commander ?",
    answer:
      "Nous proposons des packs à partir de 5 vidéos. Plus le volume est important, plus le coût unitaire diminue.",
  },
  {
    question: "Quels formats de vidéo livrez-vous ?",
    answer:
      "9:16 (vertical) pour TikTok/Reels/Stories, 1:1 pour feed, 16:9 pour YouTube. Tous les formats publicitaires courants.",
  },
  {
    question: "Puis-je demander des modifications ?",
    answer:
      "Oui, chaque pack inclut 2 tours de révisions. Les ajustements sont rapides grâce à la flexibilité de l'IA.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "UGC Ads IA",
  description:
    "Publicit\u00e9s UGC g\u00e9n\u00e9r\u00e9es par IA avec Kling 3.0. Vid\u00e9os authentiques sans tournage ni acteurs.",
  provider: {
    "@type": "Organization",
    name: "Mita Studio",
    url: "https://mita-studio.com",
  },
  areaServed: "FR",
  url: "https://mita-studio.com/ugc-ads",
};

export default function UgcAdsPage() {
  return (
    <ServicePageLayout
      title="UGC Ads IA"
      subtitle="AI-Powered Advertising"
      description="Publicités UGC générées par IA avec Kling 3.0. Vidéos authentiques qui convertissent, sans tournage ni acteurs."
      features={FEATURES}
      process={PROCESS}
      faqs={FAQS}
      ctaText="Nous contacter"
      jsonLd={JSON_LD}
    />
  );
}
