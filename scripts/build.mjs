#!/usr/bin/env node
/**
 * Cloudflare Workers Builds should prefer:
 *   npx opennextjs-cloudflare build
 *
 * This script also lets `npm run build` emit `.open-next/` when the dashboard
 * still uses the default build command. OpenNext sets NEXT_PRIVATE_STANDALONE
 * before re-invoking `npm run build` for the Next.js compile — detect that and
 * only run Next so we do not recurse.
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
