import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page introuvable",
  description: "La page que vous cherchez n'existe pas ou a été déplacée.",
};

export default function NotFound() {
  return (
    <div className="studio-page min-h-screen bg-[#050a1e] text-white flex flex-col items-center justify-center px-5">
      <p className="text-[11px] font-semibold tracking-widest text-white/70 uppercase mb-6">
        Erreur 404
      </p>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center mb-4">
        Page introuvable
      </h1>

      <p className="text-base sm:text-lg text-white/60 text-center max-w-md mb-10">
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-[#050a1e] hover:bg-white/90 active:scale-[0.98] transition-all"
        >
          Retour à l&apos;accueil
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center rounded-xl border border-white/[0.15] px-6 py-2.5 text-sm font-medium text-white hover:border-white/30 hover:bg-white/[0.04] active:scale-[0.98] transition-all"
        >
          Contactez-nous
        </Link>
      </div>
    </div>
  );
}
