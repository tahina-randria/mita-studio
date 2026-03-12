import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Avatar from "boring-avatars";

import { StudioHeader } from "../_components/StudioHeader";
import { StudioFooter } from "../_components/StudioFooter";

export const metadata: Metadata = {
  title: "Fondateur",
  description:
    "D\u00e9couvrez le parcours de Tahina Randrianandraina, fondateur de Mita Studio. Web, SEO et automatisation pour les ind\u00e9pendants et PME.",
  alternates: { canonical: "/fondateur" },
  openGraph: {
    title: "Fondateur | Mita Studio",
    description:
      "D\u00e9couvrez le parcours de Tahina Randrianandraina, fondateur de Mita Studio.",
    url: "https://mita-studio.com/fondateur",
    type: "website",
    locale: "fr_FR",
    siteName: "Mita Studio",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Mita Studio" }],
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: "Tahina Randrianandraina",
    jobTitle: "Fondateur",
    worksFor: {
      "@type": "Organization",
      name: "Mita Studio",
      url: "https://mita-studio.com",
    },
    url: "https://mita-studio.com/fondateur",
  },
};

interface Milestone {
  year: string;
  title: string;
  description: string;
}

const MILESTONES: Milestone[] = [
  {
    year: "2024",
    title: "Cr\u00e9ation de Mita Studio",
    description:
      "Lancement du studio avec une mission claire\u00a0: rendre le digital pro accessible aux petites structures.",
  },
  {
    year: "2024",
    title: "Premiers projets clients",
    description:
      "Sites web, SEO, outils sur mesure. Les premiers retours confirment l\u2019approche.",
  },
  {
    year: "2025",
    title: "Acc\u00e9l\u00e9ration",
    description:
      "M\u00e9thodes et outils optimis\u00e9s. R\u00e9sultats plus rapides, co\u00fbts r\u00e9duits pour les clients.",
  },
];

interface Skill {
  label: string;
  description: string;
}

const SKILLS: Skill[] = [
  {
    label: "D\u00e9veloppement web",
    description: "Next.js, React, TypeScript, Tailwind CSS",
  },
  {
    label: "SEO & Contenu",
    description: "Audit SEO, strat\u00e9gie de contenu, analytics",
  },
  {
    label: "Automatisation",
    description: "Workflows optimis\u00e9s, outils m\u00e9tier sur mesure",
  },
  {
    label: "Design UI/UX",
    description: "Interfaces modernes, responsive, centr\u00e9es utilisateur",
  },
];

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: "https://mita-studio.com" },
    { "@type": "ListItem", position: 2, name: "Fondateur" },
  ],
};

export default function FondateurPage() {
  return (
    <div className="studio-page min-h-screen bg-[#050a1e] text-white">
      <Script
        id="json-ld-founder"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }}
      />

      <StudioHeader />

      <main className="pt-28 sm:pt-36 pb-20 sm:pb-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-xs text-white/60 mb-10">
            <Link href="/" className="inline-block py-2 hover:text-white transition-colors">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white/80">Fondateur</span>
          </nav>

          {/* Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 mb-16 sm:mb-20">
            {/* Avatar */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden">
                <Avatar
                  size={192}
                  name="Tahina Randrianandraina"
                  variant="marble"
                  colors={["#050a1e", "#7c3aed", "#a78bfa", "#c4b5fd", "#ffffff"]}
                />
              </div>
            </div>

            {/* Bio */}
            <div className="lg:col-span-2">
              <p className="text-xs uppercase tracking-[0.25em] text-white/60 font-medium mb-3">
                Fondateur
              </p>
              <h1 className="text-3xl sm:text-4xl text-white tracking-tight mb-4">
                Tahina Randrianandraina
              </h1>
              <p className="text-base sm:text-lg text-white leading-relaxed mb-4">
                J&rsquo;ai cr&eacute;&eacute; Mita Studio apr&egrave;s un constat simple&nbsp;:
                trop de petites entreprises payent cher pour un digital qui ne leur rapporte rien.
                On peut faire mieux, plus vite,
                pour beaucoup moins.
              </p>
              <p className="text-base sm:text-lg text-white leading-relaxed mb-6">
                Mon obsession&nbsp;: que chaque euro investi par nos clients
                se transforme en r&eacute;sultat concret. Pas de jargon,
                pas de promesses vides. Juste du travail bien fait.
              </p>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-white transition-colors group"
              >
                Me contacter
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          {/* Skills */}
          <section className="mb-16 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl text-white tracking-tight mb-8">
              Comp&eacute;tences
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {SKILLS.map((skill) => (
                <div
                  key={skill.label}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 hover:border-white/[0.12] hover:bg-white/[0.04] hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)] transition-all duration-300"
                >
                  <h3 className="text-base font-medium text-white mb-1">
                    {skill.label}
                  </h3>
                  <p className="text-sm text-white/60">{skill.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Parcours */}
          <section className="mb-16 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl text-white tracking-tight mb-8">
              Parcours
            </h2>
            <div className="space-y-8">
              {MILESTONES.map((m, i) => (
                <div key={i} className="flex gap-5 sm:gap-8">
                  <span className="text-sm font-mono text-white/60 shrink-0 pt-0.5 tabular-nums">
                    {m.year}
                  </span>
                  <div>
                    <h3 className="text-base font-medium text-white mb-1">
                      {m.title}
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed max-w-lg">
                      {m.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="border-t border-white/[0.06] pt-10 text-center">
            <h2 className="text-2xl sm:text-3xl text-white mb-4">
              Un projet en t&ecirc;te&nbsp;?
            </h2>
            <p className="text-base text-white/60 mb-6">
              Premier &eacute;change gratuit, sans engagement.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white text-[#0a0a0a] px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-white/90 active:scale-[0.98] transition-all"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </main>

      <StudioFooter />
    </div>
  );
}
