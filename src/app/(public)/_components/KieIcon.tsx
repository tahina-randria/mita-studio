import Image from "next/image";

interface KieIconProps {
  src: string;
  size?: number;
  className?: string;
}

/**
 * Displays a Kié-generated thin-line icon with mix-blend-mode: screen
 * so the black background becomes transparent and only white lines show.
 */
export function KieIcon({ src, size = 24, className = "" }: KieIconProps) {
  return (
    <span
      className={`relative inline-block mix-blend-screen ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt=""
        fill
        className="object-contain"
        sizes={`${size}px`}
        aria-hidden="true"
      />
    </span>
  );
}
