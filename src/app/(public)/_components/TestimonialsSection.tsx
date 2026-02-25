"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Image from "next/image";
import { setReducedMotionState } from "@/lib/motion";

interface Commitment {
  icon: string;
  title: string;
  description: string;
}

const COMMITMENTS: Commitment[] = [
  {
    icon: "/images/icons/icon-timer.webp",
    title: "Livraison rapide",
    description:
      "Votre site est en ligne en 2 \u00e0 4\u00a0semaines. On s\u2019engage sur un planning pr\u00e9cis d\u00e8s le d\u00e9part.",
  },
  {
    icon: "/images/icons/icon-contract.webp",
    title: "Prix fix\u00e9, z\u00e9ro surprise",
    description:
      "Le devis est d\u00e9finitif. Pas de frais cach\u00e9s, pas de rallonge budget. Ce qui est sign\u00e9 est respect\u00e9.",
  },
  {
    icon: "/images/icons/icon-shield.webp",
    title: "Satisfait ou on corrige",
    description:
      "Des rounds de r\u00e9visions inclus pour affiner le r\u00e9sultat. On ne livre pas tant que vous n\u2019\u00eates pas satisfait.",
  },
  {
    icon: "/images/icons/icon-handshake.webp",
    title: "Accompagnement inclus",
    description:
      "Formation prise en main, support post-lancement. On ne dispara\u00eet pas apr\u00e8s la livraison.",
  },
];

export function CommitmentsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    /* ── Mobile: simple fade ── */
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      if (headingRef.current) {
        gsap.fromTo(
          Array.from(headingRef.current.children),
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } }
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

    /* ── Desktop: full stagger + scale ── */
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      if (headingRef.current) {
        gsap.fromTo(
          Array.from(headingRef.current.children),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } }
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
        setReducedMotionState(
          Array.from(gridRef.current.children) as HTMLElement[]
        );
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 sm:py-28 border-t border-white/[0.06]"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div ref={headingRef} className="mb-10 sm:mb-14 text-center">
          <h2 className="text-3xl sm:text-4xl text-white tracking-tight">
            Nos engagements
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white max-w-lg mx-auto">
            Ce qu&rsquo;on garantit &agrave; chaque projet.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
        >
          {COMMITMENTS.map((c) => (
            <div
              key={c.title}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.05]"
            >
              {/* Icon — large, top-right corner with gradient mask + bend */}
              <div
                className="absolute -top-6 -right-6 w-44 h-44 sm:w-52 sm:h-52 pointer-events-none transition-opacity duration-500 opacity-40 group-hover:opacity-55 md:mix-blend-screen"
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
                    src={c.icon}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="208px"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-base sm:text-lg font-medium text-white mb-2">
                  {c.title}
                </h3>

                <p className="text-[15px] sm:text-base leading-relaxed text-white max-w-[80%]">
                  {c.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
