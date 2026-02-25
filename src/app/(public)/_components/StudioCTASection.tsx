"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setReducedMotionState } from "@/lib/motion";


export function StudioCTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    /* ── Mobile: simpler animations, no blur/scale ── */
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 75%" } }
        );
      }
      if (descRef.current) {
        gsap.fromTo(descRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 75%" } }
        );
      }
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 75%" } }
        );
      }
      if (emailRef.current) {
        gsap.fromTo(emailRef.current, { opacity: 0 },
          { opacity: 1, duration: 0.5, delay: 0.4, ease: "power2.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 75%" } }
        );
      }
    });

    /* ── Desktop: full blur + scale + glow animations ── */
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 75%" } }
        );
      }
      if (descRef.current) {
        gsap.fromTo(descRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 75%" } }
        );
      }
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current,
          { opacity: 0, y: 40, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.5, ease: "back.out(1.4)",
            scrollTrigger: { trigger: sectionRef.current, start: "top 75%" } }
        );
      }
      if (emailRef.current) {
        gsap.fromTo(emailRef.current, { opacity: 0 },
          { opacity: 1, duration: 0.6, delay: 0.7, ease: "power2.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 75%" } }
        );
      }
      /* ── Pulsing glow — desktop only ── */
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          opacity: 0.8, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1,
        });
      }
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      setReducedMotionState(titleRef.current);
      setReducedMotionState(descRef.current);
      setReducedMotionState(ctaRef.current);
      setReducedMotionState(emailRef.current);
      if (glowRef.current) gsap.set(glowRef.current, { opacity: 0.5 });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-[60vh] flex flex-col justify-center py-20 sm:py-28 relative overflow-hidden border-t border-white/[0.06]"
    >
      {/* Background glow — pulsing */}
      <div
        ref={glowRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.04), transparent 50%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 text-center">
        <h2
          ref={titleRef}
          className="text-4xl sm:text-5xl lg:text-6xl text-white mb-6 tracking-tight"
        >
          Un projet en t&ecirc;te&nbsp;?
        </h2>

        <p
          ref={descRef}
          className="text-lg sm:text-xl text-white mb-12"
        >
          Premier &eacute;change gratuit, sans engagement.
          On vous r&eacute;pond sous 24h.
        </p>

        <Link
          ref={ctaRef}
          href="/contact"
          className="inline-flex items-center justify-center bg-white text-[#0a0a0a] px-10 py-4 rounded-xl text-[15px] font-semibold hover:bg-white/90 hover:scale-[1.03] active:scale-[0.98] transition-all"
        >
          Recevoir un devis gratuit
        </Link>

        <a
          ref={emailRef}
          href="mailto:contact@mita-studio.com"
          className="block mt-4 text-sm text-white hover:text-white transition-colors"
        >
          contact@mita-studio.com
        </a>
      </div>
    </section>
  );
}
