import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { StudioHeader } from "../_components/StudioHeader";
import { StudioFooter } from "../_components/StudioFooter";
import { getArticleBySlug } from "@/lib/blog";

const SLUG = "politique-de-confidentialite";

export const metadata: Metadata = {
  title: "Politique de Confidentialité",
  description:
    "Politique de confidentialité et protection des données personnelles de Mita Studio, conforme au RGPD.",
  alternates: { canonical: "/confidentialite" },
};

export default function ConfidentialitePage() {
  const article = getArticleBySlug(SLUG);
  if (!article) return notFound();

  return (
    <>
      <StudioHeader />
      <main className="min-h-screen bg-[#050a1e] pt-32 pb-24">
        <article className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">
            {article.title}
          </h1>
          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:text-white prose-p:text-white/80
              prose-li:text-white/80 prose-strong:text-white
              prose-a:text-blue-400 prose-a:underline"
            dangerouslySetInnerHTML={{
              __html: article.content
                .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mt-8 mb-3">$1</h3>')
                .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-10 mb-4">$1</h2>')
                .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-12 mb-6">$1</h1>')
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/\n\n/g, "</p><p>")
                .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
                .replace(new RegExp("(<li.*<\\/li>)", "s"), '<ul class="list-disc pl-4 space-y-1">$1</ul>')
            }}
          />
        </article>
      </main>
      <StudioFooter />
    </>
  );
}
