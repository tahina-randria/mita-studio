import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { StudioHeader } from "../_components/StudioHeader";
import { StudioFooter } from "../_components/StudioFooter";
import { LegalPageLayout } from "../_components/LegalPageLayout";
import { getArticleBySlug } from "@/lib/blog";

const SLUG = "conditions-generales-de-vente";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente",
  description:
    "Conditions générales de vente des prestations de Mita Studio : création de sites web, référencement Google et outils digitaux.",
  alternates: { canonical: "/cgv" },
};

export default function CGVPage() {
  const article = getArticleBySlug(SLUG);
  if (!article) return notFound();

  return (
    <div className="studio-page min-h-screen bg-[#050a1e] text-white">
      <StudioHeader />
      <LegalPageLayout article={article} breadcrumbLabel="Conditions Générales de Vente" />
      <StudioFooter />
    </div>
  );
}
