import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { StudioHeader } from "../_components/StudioHeader";
import { StudioFooter } from "../_components/StudioFooter";
import { LegalPageLayout } from "../_components/LegalPageLayout";
import { getLegalArticle } from "@/lib/legal";

const SLUG = "politique-de-confidentialite";

export const metadata: Metadata = {
  title: "Politique de Confidentialité",
  description:
    "Politique de confidentialité et protection des données personnelles de Mita Studio, conforme au RGPD.",
  alternates: { canonical: "/confidentialite" },
};

export default function ConfidentialitePage() {
  const article = getLegalArticle(SLUG);
  if (!article) return notFound();

  return (
    <div className="studio-page min-h-screen bg-[#050a1e] text-white">
      <StudioHeader />
      <LegalPageLayout article={article} breadcrumbLabel="Politique de Confidentialité" />
      <StudioFooter />
    </div>
  );
}
