"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Sticky CTA bar for mobile — appears after scrolling past the hero.
 * Hidden on desktop (md+). Fades in/out with CSS transition.
 */
export function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past ~80% of viewport height
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-[#050a1e] border-t border-white/[0.08] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Link
          href="/contact"
          className="block w-full rounded-xl bg-white py-3 text-center text-sm font-semibold text-[#0a0a0a] active:scale-[0.98] transition-transform"
        >
          Recevoir un devis gratuit
        </Link>
      </div>
    </div>
  );
}
