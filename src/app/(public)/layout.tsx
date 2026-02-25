import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SmoothScrollProvider>{children}</SmoothScrollProvider>;
}
