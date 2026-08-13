# Lux Leaf Tea

Premium loose-leaf tea ecommerce boutique built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, and Stripe.

## Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS design system derived from Lux Leaf logo colours
- Prisma ORM on PostgreSQL (local Postgres for dev; serverless Postgres such as Neon in production)
- Deployable to Cloudflare Workers via the OpenNext adapter (`@opennextjs/cloudflare`)
- Stripe Checkout (with demo checkout when Stripe keys are absent)
- Modular supplier notifications (Email / SMS / Slack / WeCom)
- Catalog-grounded AI shopping assistant

## Brand assets

Official logo files (do not replace):

- `public/images/images/luxe-leaf-tea-logo-1200.webp` (desktop ≥1024px)
- `public/images/images/luxe-leaf-tea-logo-900-tablet.webp` (tablet 768–1023px)
- `public/images/images/luxe-leaf-tea-logo-600.webp` (mobile &lt;768px)

The header uses a responsive `<picture>` implementation and links to `/` with accessible label **Lux Leaf Tea — Home**.

## Getting started

You need a running PostgreSQL. To create a local database:

```bash
createdb luxleaftea   # or: psql -c "CREATE DATABASE luxleaftea;"
```

Then:

```bash
npm install
cp .env.example .env          # defaults point at a local Postgres
npx prisma migrate deploy     # or `npx prisma migrate dev`
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful scripts

- `npm run dev` — local development server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript check
- `npm run db:seed` — seed catalog, suppliers, content, admin user
- `npm run db:studio` — Prisma Studio
- `npm run preview` — build and run the app in the Cloudflare Workers runtime locally
- `npm run deploy` — build and deploy to Cloudflare Workers

## Deploy to Cloudflare Workers

The app runs on Cloudflare Workers through the [OpenNext](https://opennext.js.org/cloudflare) adapter. Because the Workers runtime cannot open raw TCP database sockets, Prisma talks to Postgres through the Neon serverless driver adapter on Workers (`src/lib/prisma.ts` selects it automatically at runtime); in Node.js it uses the standard Prisma engine. Use a serverless Postgres such as [Neon](https://neon.tech) in production.

1. Create a Postgres database (e.g. a Neon project) and note the **pooled** and **direct** connection strings.
2. Push the schema to it:
   ```bash
   DATABASE_URL="<direct-url>" DIRECT_URL="<direct-url>" npx prisma migrate deploy
   DATABASE_URL="<direct-url>" DIRECT_URL="<direct-url>" npm run db:seed
   ```
3. Set the runtime secret (pooled URL) on the Worker:
   ```bash
   npx wrangler secret put DATABASE_URL      # paste the POOLED connection string
   # optional, to enable real Stripe checkout:
   npx wrangler secret put STRIPE_SECRET_KEY
   npx wrangler secret put STRIPE_WEBHOOK_SECRET
   ```
4. Deploy:
   ```bash
   npm run deploy
   ```

Configuration lives in `wrangler.jsonc` (`nodejs_compat` is required) and `open-next.config.ts`.

### Local Workers preview

`npm run preview` runs the built app in the Workers runtime (`workerd`) locally. To point it at your **local** Postgres, copy `.dev.vars.example` to `.dev.vars` and start the bundled WebSocket→TCP proxy so the serverless driver can reach it:

```bash
cp .dev.vars.example .dev.vars   # set DATABASE_URL + NEON_WS_PROXY=localhost:5488
node scripts/neon-ws-proxy.mjs   # in one terminal
npm run preview                  # in another
```

For a real Neon database you don't need the proxy — just set `DATABASE_URL` in `.dev.vars` and leave `NEON_WS_PROXY` unset.

## Environment setup (merchant credentials)

Copy `.env.example` to `.env` and configure:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (pooled URL in production) |
| `DIRECT_URL` | Direct (non-pooled) PostgreSQL URL for Prisma Migrate / CLI |
| `NEXT_PUBLIC_SITE_URL` | Canonical production domain (used in SEO + Stripe redirects) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret for `/api/webhooks/stripe` |
| `REORDER_NOTIFY_CHANNEL` | `EMAIL`, `SMS`, `SLACK`, or `WECOM` |
| `EMAIL_WEBHOOK_URL` / `SLACK_WEBHOOK_URL` / `WECOM_WEBHOOK_URL` / `SMS_WEBHOOK_URL` | Notification provider endpoints |
| `INVENTORY_ALERT_EMAIL` | Fallback recipient for reorder alerts |

Without Stripe keys, checkout runs in **demo mode** (marks orders paid and finalizes inventory reservations) so local QA can complete the funnel.

### Stripe dashboard

1. Create products/prices dynamically via Checkout Sessions (already implemented).
2. Add webhook endpoint: `https://YOUR_DOMAIN/api/webhooks/stripe`
3. Subscribe to `checkout.session.completed`
4. Enable Apple Pay / Google Pay / Link in Stripe for supported countries

### WeCom / WeChat supplier alerts

Supplier notifications go through `sendSupplierReorderNotification()` and never expose webhook URLs to the browser. Configure `WECOM_WEBHOOK_URL` or per-supplier `wecomWebhook` in the database. If WeCom automation is unavailable for the merchant account type, switch `REORDER_NOTIFY_CHANNEL` to Email/Slack/SMS.

## Seeded admin

- Email: `admin@luxleaftea.com`
- Password: `changeme-admin` (change immediately)

Admin UI lives under `/admin` (add production authentication before launch).

## Core customer routes

`/`, `/shop`, `/collections/[slug]`, `/products/[slug]`, `/find-your-tea`, `/gifts`, `/tea-guide`, `/checkout`, `/order/[id]`, plus account, wishlist, search, policy, and admin routes.

## Inventory model

`stockAvailable = stockOnHand - stockReserved`

Checkout reserves stock transactionally; Stripe webhooks (or demo checkout) confirm reservations idempotently; failures/expiry release reservations. Low-stock alerts create when `stockAvailable <= reorderPoint` and no unresolved alert exists.
