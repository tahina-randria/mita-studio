"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { setReducedMotionState } from "@/lib/motion";
import { LinkedinLogo } from "@phosphor-icons/react";


const FOOTER_LINKS = {
  Studio: [
    { label: "Fondateur", href: "/fondateur" },
    { label: "Blog", href: "/blog" },
  ],
  "L\u00e9gal": [
    { label: "Mentions l\u00e9gales", href: "/mentions-legales" },
    { label: "CGV", href: "/cgv" },
    { label: "Confidentialit\u00e9", href: "/confidentialite" },
  ],
};

export function StudioFooter() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (footerRef.current) {
        gsap.fromTo(
          footerRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 95%",
            },
          }
        );
      }
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      if (footerRef.current) {
        setReducedMotionState(footerRef.current);
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <footer ref={footerRef} className="border-t border-white/[0.06] py-10 sm:py-12 pb-24 md:pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" aria-label="Mita Studio — Accueil">
              <Image
                src="/images/logo.svg"
                alt="Mita Studio"
                width={100}
                height={33}
                className="h-7 w-auto mb-2"
              />
            </Link>
            <p className="text-xs text-white leading-relaxed mb-3">
              Sites web, SEO &amp; automatisation
              <br />
              propuls&eacute;s par l&rsquo;IA.
            </p>
            <a
              href="https://www.linkedin.com/company/mita-studio"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Mita Studio sur LinkedIn"
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/50 hover:text-white hover:border-white/[0.12] transition-all"
            >
              <LinkedinLogo size={16} weight="bold" />
            </a>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <nav key={title} aria-label={title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
                {title}
              </p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white">
            &copy; {new Date().getFullYear()} Mita Studio. Tous droits r&eacute;serv&eacute;s.
          </p>
          <a
            href="mailto:contact@mita-studio.com"
            className="text-xs text-white hover:text-white transition-colors"
          >
            contact@mita-studio.com
          </a>
        </div>
      </div>
    </footer>
  );
}
