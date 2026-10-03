import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://mita-studio.com"),
  title: "Something cooler is cooking.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Something cooler is cooking.",
    type: "website",
    locale: "en_US",
    url: "https://mita-studio.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Something cooler is cooking.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster position="bottom-right" richColors />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
