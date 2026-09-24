# NEXORA — Storefront (Next.js + Prisma + Neon)

Production e-commerce app for the NEXORA streetwear brand. Built to match the
Claude Design mockup kept at the repository root.

**Stack:** Next.js 15 (App Router, TypeScript) · Prisma · PostgreSQL (Neon) ·
Auth.js v5 · Tailwind (GENRAGE design tokens) · Cloudinary (images) ·
Razorpay (payments).

## Quick start

```bash
cd web
cp .env.example .env      # fill in the values (see below)
npm install
npm run db:push           # create tables in your Neon database
npm run db:seed           # demo admin + customer + sample catalogue
npm run dev               # http://localhost:3000
```

Demo logins (from the seed): admin `admin@nexora.test` / `admin1234`,
customer `customer@nexora.test` / `customer1234`.

## Environment variables (`web/.env`)

| Var | Needed for | Where to get it |
|---|---|---|
| `DATABASE_URL` / `DIRECT_URL` | Database | Neon dashboard → Connect (pooled + direct) |
| `AUTH_SECRET` | Auth sessions | `openssl rand -base64 32` |
| `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | Image uploads | Cloudinary dashboard |
| `RAZORPAY_KEY_ID` / `_KEY_SECRET` | Online payments (test) | Razorpay → Settings → API Keys (Test mode) |
| `NEXT_PUBLIC_SITE_URL` | SEO / sitemap | Your domain (or `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID` / `_SECRET` (optional) | Google login | Google Cloud console |

Blank Cloudinary → uploads show a "not configured" message. Blank Razorpay →
online payment is hidden; Cash on Delivery still works.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `start` | Production build / serve |
| `npm run db:push` | Sync schema to the database |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Prisma Studio (browse the DB) |

## Structure

```
web/src/
  app/(store)/     storefront: home, shop, product, cart, checkout, order
  app/admin/       admin panel (products, orders) — admin role only
  app/api/         auth, cart, checkout, admin, support endpoints
  auth.ts, auth.config.ts, middleware.ts   Auth.js v5 (role-based access)
  components/store/  header, footer, viewers, cart, support widget
  data/support.ts    EDIT: chatbot FAQ, policies, WhatsApp number
  lib/               prisma, cart, orders, razorpay, cloudinary, validation
prisma/schema.prisma  data model (Postgres)
```

## Deploy (Vercel)

1. Push to GitHub (done) and import the repo in Vercel.
2. Set **Root Directory** to `web`.
3. Add all env vars from the table above (use your production URLs).
4. Deploy. Run `npm run db:push` once against the production database.

The mockup (static Design Component files) remains at the repository root as the
visual source of truth — it is not part of this app's build.
