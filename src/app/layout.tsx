import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import { CookieBanner } from "@/components/CookieBanner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050a1e",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://mita-studio.com"),
  title: {
    default: "Mita Studio — Sites web & référencement",
    template: "%s | Mita Studio",
  },
  description:
    "Votre site pro en ligne dans 2 semaines. Création de sites web sur mesure et référencement multilingue pour indépendants et PME. À partir de 790\u00a0€.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Mita Studio — Sites web & référencement",
    description:
      "Votre site pro en ligne dans 2 semaines. Sites web sur mesure et référencement multilingue. À partir de 790\u00a0€.",
    type: "website",
    locale: "fr_FR",
    siteName: "Mita Studio",
    url: "https://mita-studio.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mita Studio — Sites web & référencement",
    description:
      "Votre site pro en ligne dans 2 semaines. Sites web sur mesure et référencement multilingue. À partir de 790\u00a0€.",
    images: ["https://mita-studio.com/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Toaster position="bottom-right" richColors />
        <CookieBanner />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
