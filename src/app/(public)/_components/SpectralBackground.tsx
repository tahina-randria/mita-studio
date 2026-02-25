"use client";

import { useEffect, useState } from "react";
import { MeshGradient } from "@paper-design/shaders-react";

/**
 * Animated spectral gradient background.
 * Predominantly dark navy with concentrated spectral accents.
 * On mobile: reduced speed + distortion for battery & performance.
 * Falls back to CSS gradient if WebGL is too heavy.
 */
export function SpectralBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Mobile: lightweight CSS gradient instead of WebGL (saves GPU + battery) */}
      {isMobile ? (
        <div
          className="w-full h-full"
          style={{
            background:
              "radial-gradient(ellipse 120% 80% at 50% 30%, #1a1045 0%, #0a1235 30%, #050a1e 60%, #020510 100%)",
          }}
        />
      ) : (
        <MeshGradient
          style={{ width: "100%", height: "100%" }}
          colors={[
            "#020510",
            "#050a1e",
            "#0a1235",
            "#1a1045",
            "#2d1250",
            "#451838",
            "#3a1a30",
          ]}
          speed={0.08}
          distortion={0.35}
          swirl={0.25}
          scale={1.2}
        />
      )}
      {/* Dark vignette overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(2,5,16,0.5) 100%)",
        }}
      />
    </div>
  );
}
