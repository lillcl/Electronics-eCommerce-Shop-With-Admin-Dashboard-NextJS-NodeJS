# Singitronic — Electronics eCommerce on Next.js + Supabase

A modern, fork-and-customize e-commerce starter: storefront, admin dashboard, Supabase Auth, Supabase Database, Supabase Storage. No Express server, no Prisma, no MySQL.

This repo was originally forked from
[`Kuzma02/Electronics-eCommerce-Shop-With-Admin-Dashboard-NextJS-NodeJS`](https://github.com/Kuzma02/Electronics-eCommerce-Shop-With-Admin-Dashboard-NextJS-NodeJS)
and rewritten on top of Supabase. The original used Next.js + Express + MySQL + Prisma + NextAuth. Everything that touched MySQL, Prisma, NextAuth, or the Express server has been removed.

## Stack

- **Next.js 15** (App Router) + **React 18** + **TypeScript**
- **Supabase** — Auth, Postgres, Storage, RLS
- **@supabase/ssr** — cookie-based auth in server components, route handlers, and middleware
- **Tailwind CSS** + DaisyUI
- **Zustand** for client state
- **Playwright** for end-to-end tests
- **Zod** for input validation

## 1. Create a Supabase project

1. Go to <https://app.supabase.com> and create a new project (free tier is fine).
2. Once the project is up, open **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key (server-only) → `SUPABASE_SERVICE_ROLE_KEY`

## 2. Set up the database

Open the Supabase **SQL Editor** in the dashboard, then run the three migration files in order:

1. `supabase/migrations/0001_initial_schema.sql` — tables, enums, triggers
2. `supabase/migrations/0002_rls_policies.sql` — row-level security
3. `supabase/migrations/0003_storage.sql` — the `product-images` bucket and storage policies

Then (optionally) run `supabase/seed/seed.sql` to load demo products, categories, and merchants.

## 3. Configure environment

```bash
cp .env.example .env.local
```

Fill in the three Supabase values from step 1.

## 4. Install + run

```bash
npm install
npm run dev
```

The storefront runs on <http://localhost:3000>. There is no separate API server — Next.js talks directly to Supabase.

## 5. Make yourself an admin

The SQL trigger in `0001_initial_schema.sql` creates a `public.profiles` row for every new signup with the default role `user`. Promote yourself with the Supabase SQL editor:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

Then sign in at <http://localhost:3000/login> and visit <http://localhost:3000/admin>.

## 6. End-to-end tests

```bash
npm run e2e:install   # one-time: install Chromium
npm run e2e
```

Playwright starts the Next.js dev server automatically, then runs the smoke suite in `e2e/`. The current suite covers:

- home page renders
- login + register forms render
- `/admin` redirects anonymous users to `/login`

Add more specs alongside `e2e/home.spec.ts`.

## Customizing for your store

- **Branding** — replace `public/logo v1 svg.svg`, the favicon, and the `Singitronic` strings in `app/layout.tsx`.
- **Theme** — Tailwind tokens in `tailwind.config.ts`, DaisyUI theme in the same file.
- **Catalog shape** — the seed in `supabase/seed/seed.sql` is your starting point. Add columns in a new migration file (e.g. `0004_*.sql`) and update `lib/supabase/types.ts` to match.
- **Admin pages** — every admin page lives in `app/(dashboard)/admin/`. They all read directly from Supabase through the helpers in `lib/data/`.
- **Auth** — Supabase Auth is plug-and-play. To add Google/GitHub/etc., enable the provider in the Supabase dashboard under **Authentication → Providers**.

## Project layout

```
app/                    Next.js App Router
  (dashboard)/admin/    Admin dashboard (gated by middleware)
  api/                  Route handlers (only auth-compat endpoints now)
  login/  register/     Supabase Auth pages
  checkout/  cart/  ... Storefront
components/             UI components
e2e/                    Playwright tests
lib/
  auth.ts               Server-side auth helpers (getCurrentUser, requireAdmin, …)
  data/                 Supabase data access (products, orders, wishlist, …)
  supabase/             Client, server, middleware, admin (service role) clients
supabase/
  config.toml           Supabase CLI config
  migrations/           SQL migrations
  seed/                 Demo data
utils/                  Misc utilities
```

## Migration status (from the original repo)

- ✅ Auth — NextAuth → Supabase Auth (`lib/auth.ts`, `lib/supabase/*`)
- ✅ Catalog read paths — products, categories, merchants (`lib/data/*`)
- ✅ Orders, order items, wishlist, notifications (`lib/data/*`)
- ✅ Storage — product images go to the `product-images` bucket (`lib/data/storage.ts`)
- ⚠️ Admin CRUD pages still use the old `apiClient` for some flows. Core reads/writes have been migrated; the bulk upload UI, image upload UI, and a few admin mutations need a follow-up pass.

## License

Original project: see `LICENSE`. This Supabase rewrite is provided under the same terms.
