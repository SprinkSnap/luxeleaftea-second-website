import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Default OpenNext configuration for Cloudflare Workers.
// To enable ISR/Data Cache persistence, configure an R2 incremental cache here,
// e.g. `incrementalCache: r2IncrementalCache` from
// "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache".
export default defineCloudflareConfig();
