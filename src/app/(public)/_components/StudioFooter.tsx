"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { setReducedMotionState } from "@/lib/motion";
import { LinkedinLogo } from "@phosphor-icons/react";


const DEFAULT_STUDIO_LINKS = [
  { id: "fs-services", label: "Services", href: "#services", external: false },
  { id: "fs-pricing", label: "Tarifs", href: "#pricing", external: false },
  { id: "fs-about", label: "\u00c0 propos", href: "#about", external: false },
  { id: "fs-contact", label: "Contact", href: "/contact", external: false },
  { id: "fs-blog", label: "Blog", href: "/blog", external: false },
];

const DEFAULT_LEGAL_LINKS = [
  { id: "fl-mentions", label: "Mentions l\u00e9gales", href: "/mentions-legales", external: false },
  { id: "fl-cgv", label: "CGV", href: "/cgv", external: false },
  { id: "fl-confidentialite", label: "Confidentialit\u00e9", href: "/confidentialite", external: false },
];

const DEFAULT_SETTINGS: Record<string, string> = {
  company_name: "Mita Studio",
  contact_email: "tahina@mita-studio.com",
  linkedin_url: "https://www.linkedin.com/company/mita-studio",
};

export function StudioFooter({ studioLinks = DEFAULT_STUDIO_LINKS, legalLinks = DEFAULT_LEGAL_LINKS, settings = DEFAULT_SETTINGS }: { studioLinks?: { id: string; label: string; href: string; external: boolean }[]; legalLinks?: { id: string; label: string; href: string; external: boolean }[]; settings?: Record<string, string> }) {
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
              Sites web cl&eacute; en main
              <br />
              pour ind&eacute;pendants et&nbsp;PME.
            </p>
            <a
              href={settings.linkedin_url || "https://www.linkedin.com/company/mita-studio"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Mita Studio sur LinkedIn"
              className="inline-flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <LinkedinLogo size={20} weight="bold" />
            </a>
          </div>

          {/* Studio links */}
          <nav aria-label="Studio">
            <p className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Studio
            </p>
            <ul className="space-y-2">
              {studioLinks.map((link) => (
                <li key={link.id}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block py-2 text-sm text-white hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="inline-block py-2 text-sm text-white hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal links */}
          <nav aria-label="Légal">
            <p className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Légal
            </p>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.id}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block py-2 text-sm text-white hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="inline-block py-2 text-sm text-white hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white">
            &copy; {new Date().getFullYear()} {settings.company_name || "Mita Studio"}. Tous droits r&eacute;serv&eacute;s.
          </p>
          <a
            href={`mailto:${settings.contact_email || "tahina@mita-studio.com"}`}
            className="inline-block py-1 text-xs text-white hover:text-white transition-colors"
          >
            {settings.contact_email || "tahina@mita-studio.com"}
          </a>
        </div>
      </div>
    </footer>
  );
}
