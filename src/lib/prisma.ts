import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import ws from "ws";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const logLevels: ("error" | "warn")[] =
  process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"];

// The Cloudflare Workers runtime cannot open raw TCP database connections the
// way Node.js does, so on Workers we talk to Postgres through Neon's serverless
// driver (HTTP/WebSocket) via a Prisma driver adapter. In Node.js (local dev,
// `next dev`, migrations, seeding) we use the standard Prisma engine, which
// connects to any Postgres over TCP using DATABASE_URL.
function isCloudflareWorkers(): boolean {
  return (
    typeof navigator !== "undefined" &&
    navigator.userAgent === "Cloudflare-Workers"
  );
}

type WorkerEnv = { DATABASE_URL?: string; NEON_WS_PROXY?: string };

function workerEnv(): WorkerEnv {
  try {
    return getCloudflareContext().env as unknown as WorkerEnv;
  } catch {
    return {};
  }
}

function createPrismaClient(): PrismaClient {
  if (isCloudflareWorkers()) {
    const env = workerEnv();

    // The Workers runtime exposes a global WebSocket; other runtimes need `ws`.
    if (typeof WebSocket === "undefined") {
      neonConfig.webSocketConstructor = ws;
    }

    // Optional: route the serverless driver through a WebSocket->TCP proxy.
    // Used for local `wrangler` preview against a local Postgres; unset in prod.
    const proxy = env.NEON_WS_PROXY ?? process.env.NEON_WS_PROXY;
    if (proxy) {
      neonConfig.wsProxy = (host, port) => `${proxy}/v2?address=${host}:${port}`;
      neonConfig.useSecureWebSocket = false;
      neonConfig.pipelineConnect = false;
      neonConfig.pipelineTLS = false;
    }

    const connectionString = env.DATABASE_URL ?? process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL is not set. Configure it as a Worker secret (wrangler secret put DATABASE_URL) or in .dev.vars for local preview.",
      );
    }

    // maxUses: 1 hands out a fresh connection per pool checkout. This avoids a
    // known hang where a reused Neon WebSocket connection stalls on subsequent
    // queries in the Workers runtime. An interactive transaction still holds a
    // single connection for all of its queries.
    const adapter = new PrismaNeon({ connectionString, maxUses: 1 });
    return new PrismaClient({ adapter, log: logLevels });
  }

  return new PrismaClient({ log: logLevels });
}

// Instantiate lazily on first use. On Workers, bindings/secrets are only
// readable within a request scope, so we must not build the client at
// module-evaluation time.
function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
