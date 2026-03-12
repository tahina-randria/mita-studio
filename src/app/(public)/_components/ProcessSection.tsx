"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/* ── Calendly-style booking mockup — larger, more realistic ── */
function CalendlyMockup() {
  const days = ["Lu", "Ma", "Me", "Je", "Ve"];
  const dates = [
    { day: 10, avail: true },
    { day: 11, avail: true },
    { day: 12, avail: false },
    { day: 13, avail: true },
    { day: 14, avail: true },
    { day: 17, avail: true },
    { day: 18, avail: false },
    { day: 19, avail: true },
    { day: 20, avail: true },
    { day: 21, avail: true },
  ];
  const slots = ["9:00", "10:30", "14:00", "16:00"];

  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/[0.06]">
        <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center">
          <svg className="w-4.5 h-4.5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <span className="text-sm font-medium text-white/80 block">Appel d&eacute;couverte</span>
          <span className="text-[11px] text-white/60">20&nbsp;min &middot; Gratuit</span>
        </div>
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-white/60">Mars 2026</span>
        <div className="flex gap-1">
          <div className="w-6 h-6 rounded-md bg-white/[0.04] flex items-center justify-center">
            <svg className="w-3 h-3 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <div className="w-6 h-6 rounded-md bg-white/[0.04] flex items-center justify-center">
            <svg className="w-3 h-3 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-5 gap-1.5 mb-4">
        {days.map((d) => (
          <span key={d} className="text-[10px] text-white/60 text-center font-medium pb-1">{d}</span>
        ))}
        {dates.map((d, i) => (
          <div
            key={d.day}
            className={`aspect-square rounded-lg text-xs flex items-center justify-center ${
              i === 3
                ? "bg-white text-[#0a0a0a] font-semibold shadow-lg shadow-white/10"
                : d.avail
                  ? "bg-white/[0.04] text-white/60"
                  : "text-white/60"
            }`}
          >
            {d.day}
          </div>
        ))}
      </div>

      {/* Time slots */}
      <div className="pt-3 border-t border-white/[0.06]">
        <span className="text-[10px] text-white/60 uppercase tracking-wider block mb-2.5">Cr&eacute;neaux disponibles</span>
        <div className="grid grid-cols-2 gap-2">
          {slots.map((t, i) => (
            <div
              key={t}
              className={`rounded-lg py-2.5 text-xs text-center font-medium ${
                i === 1
                  ? "bg-white text-[#0a0a0a] shadow-lg shadow-white/10"
                  : "bg-white/[0.04] text-white/60"
              }`}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Google Meet — real Kie-generated image ── */
function MeetMockup() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02]">
      <Image
        src="/images/process/google-meet.webp"
        alt="Appel visio de pr\u00e9sentation avec Mita Studio"
        width={2752}
        height={1536}
        className="w-full h-auto"
        sizes="(max-width: 768px) 100vw, 420px"
        quality={90}
      />
    </div>
  );
}

/* ── Deployed site browser mockup — light/white theme ── */
function SiteMockup() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-[#fafafa] shadow-2xl shadow-white/[0.03]">
      {/* Browser chrome — light */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#f0f0f0] border-b border-[#e0e0e0]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 mx-3 rounded-md bg-white px-3 py-1 flex items-center gap-1.5 border border-[#e0e0e0]">
          <svg className="w-2.5 h-2.5 text-[#28c840] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-[10px] text-[#666]">votre-site.com</span>
        </div>
      </div>

      {/* Page content — white */}
      <div className="p-5 sm:p-6 space-y-3">
        {/* Nav */}
        <div className="flex items-center justify-between mb-4">
          <div className="h-3 w-16 rounded bg-[#1a1a1a]" />
          <div className="flex gap-3">
            <div className="h-2 w-10 rounded bg-[#ddd]" />
            <div className="h-2 w-10 rounded bg-[#ddd]" />
            <div className="h-2 w-10 rounded bg-[#ddd]" />
          </div>
        </div>
        {/* Hero */}
        <div className="h-5 w-3/4 rounded bg-[#1a1a1a]" />
        <div className="h-2 w-full rounded bg-[#e5e5e5]" />
        <div className="h-2 w-5/6 rounded bg-[#e5e5e5]" />
        <div className="flex gap-2 pt-2">
          <div className="h-7 w-20 rounded-lg bg-[#1a1a1a]" />
          <div className="h-7 w-16 rounded-lg bg-white border border-[#ddd]" />
        </div>
        {/* Cards row */}
        <div className="flex gap-2 pt-3">
          <div className="flex-1 h-14 rounded-lg bg-[#f5f5f5] border border-[#eee]" />
          <div className="flex-1 h-14 rounded-lg bg-[#f5f5f5] border border-[#eee]" />
          <div className="flex-1 h-14 rounded-lg bg-[#f5f5f5] border border-[#eee]" />
        </div>
      </div>

      {/* Lighthouse scores */}
      <div className="px-5 pb-4 pt-2 border-t border-[#eee] flex justify-around">
        {[
          { label: "Perf", val: "98" },
          { label: "SEO", val: "100" },
          { label: "A11y", val: "95" },
        ].map((m) => (
          <div key={m.label} className="flex flex-col items-center gap-0.5">
            <span className="text-xs font-bold text-emerald-500">{m.val}</span>
            <span className="text-[8px] text-[#999] uppercase tracking-wider">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main section — scroll-driven reveal ── */
export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    /* ── Mobile: simple fade, NO scrub ── */
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      if (progressRef.current) {
        gsap.set(progressRef.current, { scaleY: 1 });
      }

      if (headingRef.current) {
        gsap.fromTo(
          Array.from(headingRef.current.children),
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: headingRef.current, start: "top 85%" } }
        );
      }

      if (stepsRef.current) {
        const steps = stepsRef.current.querySelectorAll("[data-step]");
        steps.forEach((step) => {
          gsap.fromTo(step,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
              scrollTrigger: { trigger: step, start: "top 90%" } }
          );
        });

        gsap.set(stepsRef.current.querySelectorAll("[data-dot]"), { scale: 1, opacity: 1 });
      }
    });

    /* ── Desktop: full scrub-driven animations ── */
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      if (progressRef.current && sectionRef.current) {
        gsap.fromTo(
          progressRef.current,
          { scaleY: 0 },
          {
            scaleY: 1, ease: "none",
            scrollTrigger: { trigger: sectionRef.current, start: "top 50%", end: "bottom 50%", scrub: true },
          }
        );
      }

      if (headingRef.current) {
        gsap.fromTo(
          Array.from(headingRef.current.children),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: headingRef.current, start: "top 85%" } }
        );
      }

      if (stepsRef.current) {
        const steps = stepsRef.current.querySelectorAll("[data-step]");
        steps.forEach((step) => {
          gsap.fromTo(step,
            { opacity: 0.12, y: 10 },
            { opacity: 1, y: 0, ease: "none",
              scrollTrigger: { trigger: step, start: "top 85%", end: "top 45%", scrub: true } }
          );
        });

        const dots = stepsRef.current.querySelectorAll("[data-dot]");
        dots.forEach((dot) => {
          gsap.fromTo(dot,
            { scale: 0.4, opacity: 0.15 },
            { scale: 1, opacity: 1, ease: "none",
              scrollTrigger: { trigger: dot, start: "top 80%", end: "top 50%", scrub: true } }
          );
        });
      }
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      if (headingRef.current) {
        gsap.set(Array.from(headingRef.current.children), { opacity: 1, y: 0 });
      }
      if (stepsRef.current) {
        gsap.set(stepsRef.current.querySelectorAll("[data-step]"), { opacity: 1, y: 0 });
        gsap.set(stepsRef.current.querySelectorAll("[data-dot]"), { scale: 1, opacity: 1 });
      }
      if (progressRef.current) {
        gsap.set(progressRef.current, { scaleY: 1 });
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="border-t border-white/[0.06] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 w-full">
        {/* Heading */}
        <div ref={headingRef} className="mb-16 sm:mb-24 text-center">
          <h2 className="text-3xl text-white sm:text-4xl tracking-tight">
            Comment &ccedil;a marche
          </h2>
          <p className="mt-4 text-base text-white max-w-md mx-auto">
            3&nbsp;&eacute;tapes. Pas de jargon.
          </p>
        </div>

        {/* Steps with scroll-driven progress line */}
        <div ref={stepsRef} className="relative pl-8 md:pl-14">
          {/* Background line (dim) */}
          <div className="absolute left-3 md:left-5 top-0 bottom-0 w-px bg-white/[0.06]" />
          {/* Progress line (fills white on scroll) */}
          <div
            ref={progressRef}
            className="absolute left-3 md:left-5 top-0 bottom-0 w-px bg-white/60 origin-top"
            style={{ transform: "scaleY(0)" }}
          />

          <div className="space-y-20 md:space-y-28">
            {/* ── Step 1: On échange ── */}
            <div data-step className="relative">
              {/* Dot */}
              <div
                data-dot
                className="absolute -left-8 md:-left-14 top-1 w-6 md:w-10 flex justify-center"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
              </div>

              <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-10">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-white tabular-nums">01</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-3 tracking-tight">
                    On &eacute;change
                  </h3>
                  <p className="text-[15px] sm:text-lg leading-relaxed text-white mb-6 max-w-lg">
                    Un appel de 20&nbsp;min pour comprendre votre projet, vos objectifs et votre budget. Gratuit, sans engagement.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-[#0a0a0a] hover:bg-white/90 active:scale-[0.97] transition-all"
                  >
                    R&eacute;server un cr&eacute;neau
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
                <div className="w-full md:w-80 lg:w-[360px] shrink-0">
                  <CalendlyMockup />
                </div>
              </div>
            </div>

            {/* ── Step 2: On vous montre ── */}
            <div data-step className="relative">
              <div
                data-dot
                className="absolute -left-8 md:-left-14 top-1 w-6 md:w-10 flex justify-center"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
              </div>

              <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-10">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-white tabular-nums">02</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-3 tracking-tight">
                    On vous montre
                  </h3>
                  <p className="text-[15px] sm:text-lg leading-relaxed text-white max-w-lg">
                    En quelques jours, vous recevez une premi&egrave;re version. On vous la pr&eacute;sente en visio. Vous validez, on ajuste, jusqu&rsquo;&agrave; ce que &ccedil;a vous plaise.
                  </p>
                </div>
                <div className="w-full md:w-80 lg:w-[360px] shrink-0">
                  <MeetMockup />
                </div>
              </div>
            </div>

            {/* ── Step 3: C'est en ligne ── */}
            <div data-step className="relative">
              <div
                data-dot
                className="absolute -left-8 md:-left-14 top-1 w-6 md:w-10 flex justify-center"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
              </div>

              <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-10">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-white tabular-nums">03</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-3 tracking-tight">
                    C&rsquo;est en ligne
                  </h3>
                  <p className="text-[15px] sm:text-lg leading-relaxed text-white max-w-lg">
                    Votre site est live avec son contenu r&eacute;dig&eacute;, optimis&eacute; pour Google, pr&ecirc;t &agrave; recevoir vos clients. Formation prise en main incluse.
                  </p>
                </div>
                <div className="w-full md:w-80 lg:w-[360px] shrink-0">
                  <SiteMockup />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* spacer */}
        <div className="mt-12" />
      </div>
    </section>
  );
}
