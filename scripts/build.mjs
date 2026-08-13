#!/usr/bin/env node
/**
 * Cloudflare Workers Builds runs `npm run build`, then `wrangler deploy`.
 * Wrangler forwards to `opennextjs-cloudflare deploy`, which needs `.open-next/`.
 *
 * OpenNext's own build sets NEXT_PRIVATE_STANDALONE and then invokes this
 * script again for the Next.js compile. Detect that and only run Next so we
 * do not recurse.
 */
import { spawnSync } from "node:child_process";

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: process.env,
    shell: false,
  });
  if (result.status) {
    process.exit(result.status ?? 1);
  }
}

if (process.env.NEXT_PRIVATE_STANDALONE === "true") {
  run("npx", ["prisma", "generate"]);
  run("npx", ["next", "build"]);
  process.exit(0);
}

run("npx", ["opennextjs-cloudflare", "build"]);
