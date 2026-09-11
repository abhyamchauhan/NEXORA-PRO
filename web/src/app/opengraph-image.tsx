import { ImageResponse } from "next/og";

export const alt = "NEXORA — Premium Streetwear";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default social share image for the whole site (product pages override it).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          background: "#000000",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 40,
            color: "#c4c4c4",
            letterSpacing: 8,
            marginBottom: 12,
          }}
        >
          PREMIUM STREETWEAR
        </div>
        <div
          style={{
            fontSize: 180,
            color: "#ffffff",
            fontWeight: 700,
            letterSpacing: -4,
            lineHeight: 1,
          }}
        >
          NEXORA
        </div>
        <div style={{ fontSize: 32, color: "#6b6b6b", marginTop: 20 }}>
          Men · Women · Kids
        </div>
      </div>
    ),
    { ...size },
  );
}
