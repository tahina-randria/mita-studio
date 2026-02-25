import type { Metadata } from "next";
import Script from "next/script";

import { StudioHeader } from "../_components/StudioHeader";
import { StudioFooter } from "../_components/StudioFooter";
import { BLOG_ARTICLES } from "@/lib/blog";
import { BlogPageClient } from "./BlogPageClient";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights, guides et actualit\u00e9s du digital par Mita Studio.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog | Mita Studio",
    description:
      "Insights, guides et actualit\u00e9s du digital par Mita Studio.",
    url: "https://mita-studio.com/blog",
    type: "website",
    locale: "fr_FR",
    siteName: "Mita Studio",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Mita Studio" }],
  },
};

const BLOG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Blog Mita Studio",
  url: "https://mita-studio.com/blog",
  description: "Insights, guides et actualit\u00e9s du digital par Mita Studio.",
  inLanguage: "fr",
  publisher: {
    "@type": "Organization",
    name: "Mita Studio",
    url: "https://mita-studio.com",
  },
};

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: "https://mita-studio.com" },
    { "@type": "ListItem", position: 2, name: "Blog" },
  ],
};

export default function BlogPage() {
  // Extract unique categories
  const categories = Array.from(
    new Set(BLOG_ARTICLES.map((a) => a.category))
  );

  return (
    <div className="studio-page min-h-screen bg-[#050a1e] text-white">
      <Script
        id="blog-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BLOG_JSON_LD) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }}
      />
      <StudioHeader />

      <BlogPageClient articles={BLOG_ARTICLES} categories={categories} />

      <StudioFooter />
    </div>
  );
}
