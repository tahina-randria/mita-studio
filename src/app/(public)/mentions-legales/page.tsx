import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { StudioHeader } from "../_components/StudioHeader";
import { StudioFooter } from "../_components/StudioFooter";
import { LegalPageLayout } from "../_components/LegalPageLayout";
import { getLegalArticle } from "@/lib/legal";

const SLUG = "mentions-legales";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site mita-studio.com conformément à la loi LCEN du 21 juin 2004.",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesPage() {
  const article = getLegalArticle(SLUG);
  if (!article) return notFound();

  return (
    <div className="studio-page min-h-screen bg-[#050a1e] text-white">
      <StudioHeader />
      <LegalPageLayout article={article} breadcrumbLabel="Mentions légales" />
      <StudioFooter />
    </div>
  );
}
