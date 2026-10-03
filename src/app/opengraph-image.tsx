import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Something cooler is cooking.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          background: "radial-gradient(ellipse at 50% 46%, #2a1810 0%, #070505 55%, #000 100%)",
          color: "#f2eee8",
        }}
      >
        <div style={{ fontSize: 64, letterSpacing: "-0.035em" }}>Something cooler is cooking.</div>
      </div>
    ),
    size,
  );
}
