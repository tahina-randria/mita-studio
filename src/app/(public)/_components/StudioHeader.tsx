"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { List, X } from "@phosphor-icons/react";


const DEFAULT_NAV_LINKS = [
  { id: "nav-services", label: "Services", href: "#services", external: false },
  { id: "nav-pricing", label: "Tarifs", href: "#pricing", external: false },
  { id: "nav-testimonials", label: "T\u00e9moignages", href: "#testimonials", external: false },
  { id: "nav-about", label: "\u00c0 propos", href: "#about", external: false },
  { id: "nav-blog", label: "Blog", href: "/blog", external: false },
];

export function StudioHeader({ navLinks = DEFAULT_NAV_LINKS }: { navLinks?: { id: string; label: string; href: string; external: boolean }[] }) {
  const headerRef = useRef<HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  // On homepage: scroll to hash after navigation (e.g. from /blog → /#services)
  useEffect(() => {
    if (!isHomePage) return;
    const hash = window.location.hash;
    if (!hash) return;

    // Small delay to let the page render before scrolling
    const timer = setTimeout(() => {
      const el = document.querySelector(hash);
      if (!el) return;
      const lenis = (
        window as unknown as {
          __lenis?: {
            scrollTo: (el: Element, opts?: { offset?: number }) => void;
          };
        }
      ).__lenis;
      if (lenis) {
        lenis.scrollTo(el, { offset: -80 });
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [isHomePage, pathname]);

  // GSAP entrance animation + hide-on-scroll
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(headerRef.current, { opacity: 1, y: 0 });
    });

    return () => mm.revert();
  }, []);

  // Animate mobile overlay
  useEffect(() => {
    if (!overlayRef.current) return;
    if (mobileOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: "power2.out" }
      );
      const links = overlayRef.current.querySelectorAll("[data-mobile-link]");
      gsap.fromTo(
        Array.from(links),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.06,
          ease: "power3.out",
          delay: 0.1,
        }
      );
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const scrollToAnchor = useCallback(
    (href: string) => {
      setMobileOpen(false);

      // If we're not on the homepage, navigate there first with the hash
      if (!isHomePage) {
        router.push(`/${href}`);
        return;
      }

      const el = document.querySelector(href);
      if (!el) return;

      const lenis = (
        window as unknown as {
          __lenis?: {
            scrollTo: (el: Element, opts?: { offset?: number }) => void;
          };
        }
      ).__lenis;
      if (lenis) {
        lenis.scrollTo(el, { offset: -80 });
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [isHomePage, router]
  );

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    scrollToAnchor(href);
  };

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 bg-[#050a1e] md:bg-transparent"
      >
        {/* Unified glassmorphism bar — same design mobile & desktop */}
        <nav aria-label="Navigation principale" className="flex items-center justify-between w-[calc(100%-2rem)] max-w-6xl mx-auto mt-[max(0.5rem,env(safe-area-inset-top))] md:mt-[max(1rem,env(safe-area-inset-top))] rounded-2xl bg-[#0a0f25] md:bg-white/[0.04] md:backdrop-blur-2xl md:backdrop-saturate-150 border border-white/[0.06] px-4 sm:px-6 py-2.5">
          <Link
            href="/"
            className="shrink-0"
            aria-label="Mita Studio — Accueil"
          >
            <Image
              src="/images/logo.svg"
              alt="Mita Studio"
              width={100}
              height={33}
              priority
              className="h-6 sm:h-7 w-auto"
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              !link.href.startsWith('#') ? (
                <Link
                  key={link.id}
                  href={link.href}
                  className="px-3.5 py-1.5 text-sm text-white hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className="px-3.5 py-1.5 text-sm text-white hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors"
                >
                  {link.label}
                </a>
              )
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-[#0a0a0a] hover:bg-white/90 active:scale-[0.98] transition-all shrink-0"
            >
              Nous contacter
            </Link>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-full text-white hover:bg-white/[0.06] active:bg-white/[0.1] transition-colors"
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? (
                <X size={18} weight="bold" />
              ) : (
                <List size={18} weight="bold" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile fullscreen overlay */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          ref={overlayRef}
          role="dialog"
          aria-label="Menu de navigation"
          className="fixed inset-0 z-40 bg-[#050a1e] md:hidden"
        >
          <div className="flex justify-end p-4">
            <button
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center w-12 h-12 rounded-full text-white hover:bg-white/[0.06] active:bg-white/[0.1] active:scale-95 transition-all"
              aria-label="Fermer le menu"
            >
              <X size={22} weight="bold" />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center h-[calc(100%-80px)] gap-1 px-8">
            <Image
              src="/images/logo.svg"
              alt="Mita Studio"
              width={140}
              height={46}
              data-mobile-link
              className="h-10 w-auto mb-6"
            />

            {navLinks.map((link) =>
              !link.href.startsWith('#') ? (
                <Link
                  key={link.id}
                  href={link.href}
                  data-mobile-link
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-4 text-lg font-medium text-white transition-all rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] active:scale-[0.98]"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.id}
                  href={link.href}
                  data-mobile-link
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className="w-full text-center py-4 text-lg font-medium text-white transition-all rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] active:scale-[0.98]"
                >
                  {link.label}
                </a>
              )
            )}

            <div className="w-12 h-px bg-white/10 my-4" />

            <Link
              href="/contact"
              data-mobile-link
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-3.5 text-base font-semibold text-[#0a0a0a] bg-white rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all mt-3"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
