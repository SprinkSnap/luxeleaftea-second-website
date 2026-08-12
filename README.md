# Lux Leaf Tea

Premium loose-leaf tea ecommerce boutique built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, and Stripe.

## Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS design system derived from Lux Leaf logo colours
- Prisma ORM (SQLite for local/dev; PostgreSQL recommended for production)
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

```bash
npm install
cp .env.example .env
npx prisma migrate dev
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

## Environment setup (merchant credentials)

Copy `.env.example` to `.env` and configure:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | SQLite file URL or PostgreSQL connection string |
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
