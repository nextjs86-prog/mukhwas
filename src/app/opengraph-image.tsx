import { ImageResponse } from "next/og";
import { brand } from "@/config/brand";

export const alt = `${brand.name} — ${brand.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "edge";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: brand.colors.forest, color: brand.colors.ivory }}>
        <div style={{ fontSize: 96, letterSpacing: 28, fontFamily: "serif" }}>{brand.name}</div>
        <div style={{ width: 120, height: 2, background: brand.colors.gold, margin: "28px 0" }} />
        <div style={{ fontSize: 40, color: brand.colors.gold, fontStyle: "italic", fontFamily: "serif" }}>{brand.tagline}</div>
      </div>
    ),
    size
  );
}
