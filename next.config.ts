import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  turbopack: { root: process.cwd() },
  allowedDevOrigins: ["terminal.local"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vlfcveodcmyufblbaplo.supabase.co",
        pathname: "/storage/v1/object/public/portfolio/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};
export default config;
