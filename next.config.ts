import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  // Lets a verification build use a separate folder so it never clobbers a running `next dev`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: { remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }, { protocol: "https", hostname: "*.supabase.co" }] },
};
export default nextConfig;
