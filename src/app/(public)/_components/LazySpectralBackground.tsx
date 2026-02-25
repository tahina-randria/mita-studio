"use client";

import dynamic from "next/dynamic";

const SpectralBackground = dynamic(
  () =>
    import("./SpectralBackground").then((mod) => mod.SpectralBackground),
  { ssr: false }
);

export function LazySpectralBackground() {
  return <SpectralBackground />;
}
