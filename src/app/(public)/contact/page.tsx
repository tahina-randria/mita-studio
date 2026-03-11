import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

import { StudioHeader } from "../_components/StudioHeader";
import { StudioFooter } from "../_components/StudioFooter";
import { ContactForm } from "../_components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Discutons de votre projet. D\u00e9crivez-nous votre besoin, on revient vers vous rapidement.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Mita Studio",
    description:
      "Discutons de votre projet. D\u00e9crivez-nous votre besoin, on revient vers vous rapidement.",
    url: "https://mita-studio.com/contact",
    type: "website",
    locale: "fr_FR",
    siteName: "Mita Studio",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Mita Studio" }],
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contacter Mita Studio",
  url: "https://mita-studio.com/contact",
  mainEntity: {
    "@type": "Organization",
    name: "Mita Studio",
    email: "tahina@mita-studio.com",
    url: "https://mita-studio.com",
  },
};

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: "https://mita-studio.com" },
    { "@type": "ListItem", position: 2, name: "Contact" },
  ],
};

export default function ContactPage() {
  return (
    <div className="studio-page min-h-screen bg-[#050a1e] text-white">
      <Script
        id="json-ld-contact"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }}
      />

      <StudioHeader />

      <main className="relative pt-28 sm:pt-36 pb-20 sm:pb-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-xs text-white/60 mb-10">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white/80">Contact</span>
          </nav>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Left — copy */}
            <div className="lg:col-span-2 lg:pt-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-6">
                Parlons de votre projet
              </h1>

              <p className="text-base sm:text-lg text-white/70 leading-relaxed mb-8">
                D&eacute;crivez-nous votre besoin, on revient vers vous rapidement.
              </p>

              {/* Guarantees */}
              <div className="space-y-5 mb-10">
                {[
                  {
                    label: "Devis clair, sans surprise",
                    desc: "Prix fix\u00e9 d\u00e8s le d\u00e9part. Z\u00e9ro frais cach\u00e9.",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white">
                        {item.label}
                      </p>
                      <p className="text-sm text-white/60">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Direct email fallback */}
              <div className="border-t border-white/[0.06] pt-6">
                <p className="text-xs text-white/60 mb-1">
                  Vous pr&eacute;f&eacute;rez &eacute;crire directement&nbsp;?
                </p>
                <a
                  href="mailto:tahina@mita-studio.com"
                  className="text-sm text-white hover:text-white transition-colors"
                >
                  tahina@mita-studio.com
                </a>
              </div>
            </div>

            {/* Right - form */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8 lg:p-10">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </main>

      <StudioFooter />
    </div>
  );
}
