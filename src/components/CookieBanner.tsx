"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "mita-cookies-consent";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Check localStorage on mount
  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  // GSAP slide-up animation with reduced motion support
  useEffect(() => {
    if (!isVisible || !bannerRef.current) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        hasMotion: "(prefers-reduced-motion: no-preference)",
        reducedMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { reducedMotion } = context.conditions as {
          hasMotion: boolean;
          reducedMotion: boolean;
        };

        if (reducedMotion) {
          gsap.set(bannerRef.current, { opacity: 1, y: 0 });
        } else {
          gsap.fromTo(
            bannerRef.current,
            { opacity: 0, y: 80 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
          );
        }
      }
    );

    return () => mm.revert();
  }, [isVisible]);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setIsVisible(false);
  };

  const handleRefuse = () => {
    localStorage.setItem(STORAGE_KEY, "refused");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      ref={bannerRef}
      className="fixed bottom-0 left-0 right-0 z-50 opacity-0"
      role="banner"
      aria-label="Bandeau cookies"
    >
      <div className="mx-auto max-w-5xl p-4">
        <div className="rounded-lg bg-card shadow-md border border-border p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Text content */}
            <div className="flex-1 space-y-1">
              <h3 className="text-sm font-semibold text-foreground">
                &#127850; Gestion des cookies
              </h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Mita utilise des cookies pour assurer le bon fonctionnement du
                site et am&eacute;liorer votre exp&eacute;rience gr&acirc;ce
                &agrave; des analyses d&apos;usage anonymis&eacute;es.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 shrink-0">
              <Button onClick={handleAccept} size="sm">
                Accepter tout
              </Button>
              <Button onClick={handleRefuse} variant="outline" size="sm">
                Refuser
              </Button>
              <Link
                href="/confidentialite"
                className="text-sm text-foreground/50 underline underline-offset-4 hover:text-foreground transition-colors text-center sm:text-left"
              >
                En savoir plus
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
