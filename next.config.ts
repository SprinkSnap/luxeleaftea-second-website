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
  // Keep Prisma + the serverless driver out of the Next bundle so the OpenNext
  // Cloudflare adapter can build them with the `workerd` condition (uses the
  // WASM query engine instead of the native one). Without this, Prisma tries to
  // load the library engine on Workers and fails with "fs.readdir is not
  // implemented".
  serverExternalPackages: [
    "@prisma/client",
    ".prisma/client",
    "@prisma/adapter-neon",
    "@neondatabase/serverless",
  ],
};

export default nextConfig;

// Enables Cloudflare bindings (via getCloudflareContext) during `next dev`.
// No-op outside of the OpenNext Cloudflare tooling.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
void initOpenNextCloudflareForDev();
