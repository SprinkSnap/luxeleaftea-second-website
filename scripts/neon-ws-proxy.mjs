// Minimal WebSocket -> TCP proxy for LOCAL development only.
//
// The Neon serverless driver (used by the Prisma adapter on Cloudflare Workers)
// talks to Postgres over a WebSocket instead of a raw TCP socket. In production
// you point it at a real Neon database. For local `npm run preview` (which runs
// the app in the Workers runtime via wrangler) this tiny proxy lets the driver
// reach a plain local Postgres: it accepts the driver's WebSocket, reads the
// target `address=host:port` query, and pipes bytes to/from that TCP socket.
//
// Enable it by setting in .dev.vars:
//   NEON_WS_PROXY="localhost:5488"
//   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/luxleaftea"
// Then run:  node scripts/neon-ws-proxy.mjs
//
// Do NOT use this in production.
import net from "node:net";
import { WebSocketServer } from "ws";

const PORT = Number(process.env.NEON_WS_PROXY_PORT ?? 5488);
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (socket, request) => {
  const url = new URL(request.url ?? "/", `http://localhost:${PORT}`);
  const address = url.searchParams.get("address");
  if (!address) {
    socket.close();
    return;
  }
  const [host, port] = address.split(":");
  console.log(`[neon-ws-proxy] tunnel -> ${host}:${port}`);
  const tcp = net.connect({ host, port: Number(port) });

  socket.on("message", (data) => tcp.write(data));
  tcp.on("data", (data) => socket.readyState === socket.OPEN && socket.send(data));

  const cleanup = () => {
    try { tcp.end(); } catch {}
    try { socket.close(); } catch {}
  };
  socket.on("close", cleanup);
  socket.on("error", cleanup);
  tcp.on("close", cleanup);
  tcp.on("error", cleanup);
});

console.log(`[neon-ws-proxy] listening on ws://localhost:${PORT} (dev only)`);
