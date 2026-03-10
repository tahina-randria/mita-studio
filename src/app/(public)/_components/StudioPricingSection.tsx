"use client";

import { useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Check, X } from "@phosphor-icons/react";
import { setReducedMotionState } from "@/lib/motion";

interface PricingTierProp {
  id: string;
  name: string;
  price: string;
  priceNumeric: number | null;
  priceLabel: string;
  priceSuffix: string;
  description: string;
  type: string;
  featured: boolean;
  ctaLabel: string;
  ctaUrl: string;
  features: { id: string; text: string; included: boolean }[];
}


/* ── Word split component for heading ── */
function SplitHeading({
  text,
  wordsRef,
  className,
}: {
  text: string;
  wordsRef: React.MutableRefObject<HTMLSpanElement[]>;
  className?: string;
}) {
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  return (
    <h2 className={className} aria-label={text}>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <span
              ref={(el) => {
                if (el) wordsRef.current[i] = el;
              }}
              className="inline-block"
            >
              {word}
            </span>
            {i < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        ))}
      </span>
    </h2>
  );
}

/* ── Price counter component ── */
function PriceDisplay({
  tier,
  priceRef,
}: {
  tier: PricingTierProp;
  priceRef: (el: HTMLSpanElement | null) => void;
}) {
  if (tier.priceNumeric !== null) {
    return (
      <div className="flex items-baseline gap-2">
        {tier.priceLabel && (
          <span className="text-xs text-white uppercase tracking-wide">
            {tier.priceLabel}
          </span>
        )}
        <span
          ref={priceRef}
          data-target={tier.priceNumeric}
          className={`font-medium tracking-tight ${
            tier.featured ? "text-3xl sm:text-5xl text-white" : "text-3xl sm:text-4xl text-white"
          }`}
        >
          {tier.price}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-baseline gap-2">
      <span
        className={`font-medium tracking-tight ${
          tier.featured ? "text-3xl sm:text-5xl text-white" : "text-3xl sm:text-4xl text-white"
        }`}
      >
        {tier.price}
      </span>
    </div>
  );
}

export function StudioPricingSection({
  pricingTiers,
  subscriptionTiers,
}: {
  pricingTiers: PricingTierProp[];
  subscriptionTiers: PricingTierProp[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingWordsRef = useRef<HTMLSpanElement[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const priceRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const hasCountedRef = useRef(false);

  const setPriceRef = useCallback((index: number) => (el: HTMLSpanElement | null) => {
    priceRefs.current[index] = el;
  }, []);

  useEffect(() => {
    const mm = gsap.matchMedia();

    /* ── Mobile: no blur, no scale, simpler card entrance ── */
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      if (headingWordsRef.current.length > 0) {
        gsap.set(headingWordsRef.current, { opacity: 0, y: 20 });
        gsap.to(headingWordsRef.current, {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
        });
      }
      if (subtitleRef.current) {
        gsap.fromTo(subtitleRef.current, { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } });
      }
      if (gridRef.current) {
        gsap.fromTo(Array.from(gridRef.current.children),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: gridRef.current, start: "top 85%" } });
      }
      /* ── Price counter ── */
      if (!hasCountedRef.current) {
        pricingTiers.forEach((tier, i) => {
          const el = priceRefs.current[i];
          if (!el || tier.priceNumeric === null) return;
          const target = tier.priceNumeric;
          const suffix = tier.priceSuffix;
          const obj = { value: 0 };
          gsap.to(obj, {
            value: target, duration: 1.5, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%",
              onEnter: () => { hasCountedRef.current = true; } },
            onUpdate() {
              el.textContent = `${Math.round(obj.value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0")}${suffix}`;
            },
          });
        });
      }
    });

    /* ── Desktop: full blur + scale + theatrical card entrance ── */
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      if (headingWordsRef.current.length > 0) {
        gsap.set(headingWordsRef.current, { opacity: 0, y: 30 });
        gsap.to(headingWordsRef.current, {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        });
      }
      if (subtitleRef.current) {
        gsap.fromTo(subtitleRef.current, { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 75%" } });
      }
      if (gridRef.current) {
        const cards = Array.from(gridRef.current.children) as HTMLElement[];
        const featuredIndex = pricingTiers.findIndex((t) => t.featured);
        cards.forEach((card, i) => {
          const isFeatured = i === featuredIndex;
          gsap.fromTo(card,
            { opacity: 0, y: 80, scale: isFeatured ? 0.9 : 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 1, delay: isFeatured ? 0 : 0.15, ease: "power3.out",
              scrollTrigger: { trigger: gridRef.current, start: "top 80%" } }
          );
          const features = card.querySelectorAll("[data-feature]");
          if (features.length > 0) {
            gsap.fromTo(Array.from(features), { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power2.out",
                scrollTrigger: { trigger: card, start: "top 70%" } });
          }
        });
      }
      /* ── Price counter ── */
      if (!hasCountedRef.current) {
        pricingTiers.forEach((tier, i) => {
          const el = priceRefs.current[i];
          if (!el || tier.priceNumeric === null) return;
          const target = tier.priceNumeric;
          const suffix = tier.priceSuffix;
          const obj = { value: 0 };
          gsap.to(obj, {
            value: target, duration: 1.5, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%",
              onEnter: () => { hasCountedRef.current = true; } },
            onUpdate() {
              el.textContent = `${Math.round(obj.value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0")}${suffix}`;
            },
          });
        });
      }
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      setReducedMotionState(headingWordsRef.current);
      if (subtitleRef.current) {
        setReducedMotionState(subtitleRef.current);
      }
      if (gridRef.current) {
        const cards = Array.from(gridRef.current.children);
        cards.forEach((card) => {
          setReducedMotionState(card as HTMLElement);
          const features = card.querySelectorAll("[data-feature]");
          setReducedMotionState(features);
        });
      }
    });

    return () => mm.revert();
  }, [pricingTiers]);

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="min-h-screen flex flex-col justify-center py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 w-full">
        {/* Heading */}
        <div className="mb-8 sm:mb-10 text-center shrink-0">
          <SplitHeading
            text="Tarifs transparents"
            wordsRef={headingWordsRef}
            className="text-3xl text-white sm:text-4xl tracking-tight"
          />
          <p
            ref={subtitleRef}
            className="mt-4 text-base sm:text-lg text-white max-w-xl mx-auto"
          >
            Des formules claires, sans surprise.
            Choisissez le plan qui correspond &agrave; vos ambitions.
          </p>
        </div>

        {/* Pricing Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-0 md:items-stretch"
        >
          {pricingTiers.map((tier, i) => (
            <div
              key={tier.id}
              className={`relative flex flex-col transition-all duration-300 ${
                tier.featured
                  ? "liquid-glass-strong gradient-border z-10 rounded-2xl p-6 sm:p-8 lg:p-7 xl:p-9 md:scale-[1.04] md:-my-4 overflow-visible"
                  : `liquid-glass overflow-hidden p-5 sm:p-7 lg:p-6 xl:p-8 ${
                      i === 0
                        ? "rounded-2xl md:rounded-l-2xl md:rounded-r-none"
                        : "rounded-2xl md:rounded-r-2xl md:rounded-l-none"
                    }`
              }`}
            >
              {/* Featured badge — gradient accent */}
              {tier.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-block rounded-full bg-white px-5 py-1.5 text-[11px] font-semibold tracking-wider uppercase text-[#0a0a0a]">
                    Recommand&eacute;
                  </span>
                </div>
              )}

              {/* Tier header */}
              <div className={tier.featured ? "mb-6" : "mb-5"}>
                <h3 className="text-lg font-medium text-white mb-1.5">
                  {tier.name}
                </h3>
                <p className="text-[15px] text-white leading-relaxed mb-4 min-h-[36px]">
                  {tier.description}
                </p>

                {/* Price */}
                <div>
                  <PriceDisplay tier={tier} priceRef={setPriceRef(i)} />
                  {tier.priceNumeric !== null && (
                    <span className="text-xs text-white/50 ml-1">HT</span>
                  )}
                </div>
              </div>

              {/* Separator — accent gradient for featured */}
              <div
                className={`mb-5 ${
                  tier.featured
                    ? "accent-line"
                    : "border-t border-white/[0.06]"
                }`}
              />

              {/* Features */}
              <ul className={`flex-1 space-y-2.5 ${tier.featured ? "mb-6" : "mb-5"}`}>
                {tier.features.map((f) => (
                  <li key={f.id} data-feature className="flex items-start gap-2.5">
                    {f.included ? (
                      <Check
                        size={14}
                        weight="regular"
                        className="mt-0.5 shrink-0 text-white"
                      />
                    ) : (
                      <X
                        size={14}
                        weight="regular"
                        className="mt-0.5 shrink-0 text-white/30"
                      />
                    )}
                    <span
                      className={`text-sm leading-relaxed ${
                        f.included ? "text-white" : "text-white/30 line-through"
                      }`}
                    >
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={tier.ctaUrl}
                className={`mt-auto block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                  tier.featured
                    ? "btn-accent"
                    : "border border-white/[0.1] hover:border-white/20 hover:bg-white/[0.04] text-white"
                }`}
              >
                <span className="relative z-10">{tier.ctaLabel}</span>
              </a>
            </div>
          ))}
        </div>

        {/* Abonnements mensuels */}
        <div className="mt-14 sm:mt-20">
          <div className="mb-8 text-center">
            <h3 className="text-2xl sm:text-3xl text-white tracking-tight">
              Restez visible apr&egrave;s le lancement
            </h3>
            <p className="mt-3 text-base text-white max-w-lg mx-auto">
              Des forfaits mensuels pour faire vivre votre site et votre visibilit&eacute;.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {subscriptionTiers.map((sub) => (
              <div
                key={sub.id}
                className="liquid-glass rounded-2xl p-6 sm:p-7 flex flex-col"
              >
                <h4 className="text-lg font-medium text-white mb-1">
                  {sub.name}
                </h4>
                <p className="text-[15px] text-white leading-relaxed mb-4">
                  {sub.description}
                </p>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-2xl sm:text-3xl font-medium text-white">
                    {sub.price}
                    {sub.priceSuffix && (
                      <span className="text-base font-normal text-white/60">{sub.priceSuffix}</span>
                    )}
                  </span>
                  <span className="text-xs text-white/50">TTC</span>
                </div>
                <div className="border-t border-white/[0.06] mb-5" />
                <ul className="flex-1 space-y-2.5 mb-5">
                  {sub.features.map((f) => (
                    <li key={f.id} className="flex items-start gap-2.5">
                      {f.included ? (
                        <Check
                          size={14}
                          weight="regular"
                          className="mt-0.5 shrink-0 text-white"
                        />
                      ) : (
                        <X
                          size={14}
                          weight="regular"
                          className="mt-0.5 shrink-0 text-white/30"
                        />
                      )}
                      <span
                        className={`text-sm leading-relaxed ${
                          f.included ? "text-white" : "text-white/30 line-through"
                        }`}
                      >
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <a
                  href={sub.ctaUrl}
                  className="mt-auto block w-full rounded-xl py-3 text-center text-sm font-semibold border border-white/[0.1] hover:border-white/20 hover:bg-white/[0.04] text-white transition-all active:scale-[0.98]"
                >
                  {sub.ctaLabel}
                </a>
              </div>
            ))}
          </div>

          <p className="mt-5 text-center text-xs text-white">
            Engagement minimum 3&nbsp;mois. R&eacute;siliable avec 30&nbsp;jours de pr&eacute;avis. Quotas mensuels non reportables.
          </p>
        </div>

        {/* Outil métier — full-width accent card */}
        <div className="mt-10 sm:mt-14">
          <div className="relative overflow-hidden rounded-2xl gradient-border p-8 sm:p-10">
            {/* Glow */}
            <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-white/[0.06] blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-white/[0.04] blur-3xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <span className="inline-block text-xs uppercase tracking-[0.2em] font-semibold text-white mb-3">
                  Sur mesure
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Besoin d&rsquo;un outil m&eacute;tier&nbsp;?
                </h3>
                <p className="text-base text-white max-w-md leading-relaxed">
                  App web, automatisation, CRM, int&eacute;grations API.
                  On construit votre outil de z&eacute;ro, sur devis.
                </p>
              </div>
              <Link
                href="/contact"
                className="shrink-0 inline-flex items-center justify-center rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-[#0a0a0a] hover:bg-white/90 transition-all active:scale-[0.98]"
              >
                Discuter de mon projet
              </Link>
            </div>
          </div>
        </div>

        {/* Compliance */}
        <p className="mt-8 text-center text-xs text-white leading-relaxed max-w-lg mx-auto">
          TVA non applicable, article 293&nbsp;B du CGI. Le tarif final est &eacute;tabli sur devis apr&egrave;s &eacute;change.
          D&eacute;lais indicatifs, variables selon la complexit&eacute; du projet.
        </p>
      </div>
    </section>
  );
}
