import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product placeholders are SVG; logo assets are WebP in /public
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
