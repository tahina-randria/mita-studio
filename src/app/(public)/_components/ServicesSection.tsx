"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setReducedMotionState } from "@/lib/motion";

interface Service {
  title: string;
  description: string;
  href: string;
  icon: string;
  external?: boolean;
}

const SERVICES: Service[] = [
  {
    title: "Sites web",
    description:
      "Sites vitrines, e-commerce et applications web sur mesure. Design soigné, rapide, optimisé pour convertir.",
    href: "/web",
    icon: "/images/services/icon-web.webp",
  },
  {
    title: "Référencement Google",
    description:
      "Stratégie SEO complète et multilingue. Contenu optimisé, suivi de positions pour une visibilité durable.",
    href: "/seo",
    icon: "/images/services/icon-seo.webp",
  },
  {
    title: "Outils digitaux",
    description:
      "Outils sur mesure pour automatiser vos tâches répétitives. Devis, relances, rapports : ce qui prenait des heures se fait en minutes.",
    href: "/contact",
    icon: "/images/services/icon-tools.webp",
  },
];

export function ServicesSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    /* ── Mobile: simple fade, shorter distances ── */
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      if (headingRef.current) {
        gsap.fromTo(
          Array.from(headingRef.current.children),
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: headingRef.current, start: "top 85%" } }
        );
      }
      if (gridRef.current) {
        gsap.fromTo(
          Array.from(gridRef.current.children),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out",
            scrollTrigger: { trigger: gridRef.current, start: "top 85%" } }
        );
      }
    });

    /* ── Desktop: full stagger + hover-ready ── */
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      if (headingRef.current) {
        gsap.fromTo(
          Array.from(headingRef.current.children),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
            scrollTrigger: { trigger: headingRef.current, start: "top 85%" } }
        );
      }
      if (gridRef.current) {
        const cards = Array.from(gridRef.current.children);
        cards.forEach((card, i) => {
          gsap.fromTo(card,
            { opacity: 0, y: 30, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: i * 0.1, ease: "power3.out",
              scrollTrigger: { trigger: gridRef.current, start: "top 80%" } }
          );
        });
      }
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      if (headingRef.current) {
        setReducedMotionState(Array.from(headingRef.current.children));
      }
      if (gridRef.current) {
        setReducedMotionState(Array.from(gridRef.current.children));
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="services" className="min-h-[80vh] flex flex-col justify-center py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 w-full">
        <div ref={headingRef} className="mb-10 sm:mb-14 text-center">
          <h2 className="text-3xl sm:text-4xl text-white tracking-tight">
            Ce qu&rsquo;on fait pour vous
          </h2>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5"
        >
          {SERVICES.map((service) => {
            const cardContent = (
              <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] h-full transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.05]">
                {/* Icon in top-right corner with gradient fade + perspective bend */}
                <div
                  className="absolute -top-6 -right-6 w-48 h-48 sm:w-56 sm:h-56 pointer-events-none transition-opacity duration-500 opacity-40 group-hover:opacity-55 md:mix-blend-screen"
                  style={{
                    maskImage: "radial-gradient(ellipse at 85% 15%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 65%)",
                    WebkitMaskImage: "radial-gradient(ellipse at 85% 15%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 65%)",
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      transform: "perspective(600px) rotateY(-8deg) rotateX(5deg)",
                      transformOrigin: "top right",
                    }}
                  >
                    <Image
                      src={service.icon}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="160px"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 p-7 sm:p-8 flex flex-col h-full min-h-[180px]">
                  <h3 className="mb-3 text-lg font-medium text-white">
                    {service.title}
                  </h3>

                  <p className="mb-6 text-[15px] sm:text-base leading-relaxed text-white/90 flex-1 max-w-[75%]">
                    {service.description}
                  </p>

                  <span className="text-sm font-medium text-white transition-colors group-hover:text-white">
                    En savoir plus{" "}
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </span>
                </div>
              </div>
            );

            if (service.external) {
              return (
                <a key={service.title} href={service.href}>
                  {cardContent}
                </a>
              );
            }

            return (
              <Link key={service.title} href={service.href}>
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
