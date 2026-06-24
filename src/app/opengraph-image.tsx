import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "ScheduleMaster";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Латиница в OG-картинке — чтобы гарантированно рендерилась встроенным шрифтом.
export default function OpengraphImage() {
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
          background: "#F5C518",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 160,
            fontWeight: 800,
            color: "#0A0A0A",
            letterSpacing: -4,
            display: "flex",
          }}
        >
          S<span style={{ color: "#111111" }}>•</span>M
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#0A0A0A",
            marginTop: 8,
          }}
        >
          ScheduleMaster
        </div>
        <div
          style={{
            fontSize: 32,
            color: "rgba(10,10,10,0.7)",
            marginTop: 16,
          }}
        >
          Take control of your time.
        </div>
      </div>
    ),
    { ...size },
  );
}
