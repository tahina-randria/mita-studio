import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin — Mita Studio",
    template: "%s | Admin Mita Studio",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
