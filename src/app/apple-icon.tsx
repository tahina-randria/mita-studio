import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#050a1e",
          borderRadius: 40,
        }}
      >
        <svg
          width="110"
          height="90"
          viewBox="269 388 961 724"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 269.707 840.691 L 548.425 840.691 L 548.425 1111.992 L 269.707 1111.992 Z"
            fill="white"
          />
          <path
            d="M 366.43 530.324 L 606.21 388.004 L 951.457 969.668 L 711.68 1111.988 Z"
            fill="white"
          />
          <path
            d="M 951.457 388.008 L 1230.293 388.008 L 1230.293 1112.324 L 951.457 1112.324 Z"
            fill="white"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
