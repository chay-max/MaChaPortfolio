# MaCha — MachaPortfolio

Portfolio Maxwell Christopher Chay. Next.js App Router + TypeScript + Supabase Postgres/Auth/Storage. Matcha, obsidian, understated glass bento and scroll-linked motion.

## Run

Node 20.9+ (Node 24 tested).

```bash
npm ci
cp .env.example .env.local
# Fill the Supabase URL, publishable key, and owner UUID.
npm run dev
```

`npm run build` and `npm start` run the production application. Deploy to a Next.js host such as Vercel; this is a full-stack Next.js app, not a static export.

## Existing database

The project created for this portfolio is `vlfcveodcmyufblbaplo` (Singapore). Schema migrations have already been applied remotely. Do not reapply the initial migration manually to this existing project.

## First owner setup (required)

There is deliberately no public signup route and no default admin password. No privileged key is required by the application.

1. In Supabase Dashboard → Authentication → Users, create your own email/password account (or invite yourself) using the dashboard. Keep your password private.
2. Copy its user UUID. In SQL Editor, replace the placeholder and run:

```sql
insert into public.portfolio_owner(user_id)
values ('YOUR_AUTH_USER_UUID');
```

3. Set `OWNER_USER_ID=YOUR_AUTH_USER_UUID` in `.env.local` and your hosting environment. Restart the application.
4. Open `/login`. Owner membership is checked both server-side and in Postgres RLS. Anyone else is denied even if they authenticate.
5. Turn off new user signups in Supabase Auth settings. Keep email confirmation and Auth rate limits enabled. There is no public application signup endpoint, but the Supabase Auth API must also be configured appropriately.

The owner table is singleton and cannot be written through the client API. Revoking membership immediately removes database write privileges; changing the server-side owner UUID also blocks dashboard access.

## Content management

- `/dashboard`: edit name, headline, bio, general location, learning interests, contact links and profile image.
- Add/edit projects, publish or move to draft, set order, story, year, role, tags, cover and external links.
- Images upload to the `portfolio` public bucket. Treat uploaded images as public assets. Supported formats: JPEG, PNG, WebP, at most 5 MB.
- Empty contact fields are hidden from the public site. No invented contact details are used.
- Demo profile photo and project illustration are labeled clearly. Replace them in the dashboard when real photos/screenshots are available.
- Draft projects are hidden by RLS and by public server queries; knowing a draft URL does not grant access.

## Structure

- `src/app/`: public pages, project details, login, owner dashboard, server actions and upload route.
- `src/components/`: presentation, motion, forms and dashboard interface.
- `src/lib/`: public reads, server authentication, validation and domain types.
- `supabase/migrations/`: schema, RLS, storage and explicit grants.
- `tests/security.test.ts`: owner allowlist and input-validation tests.
- `tests/rls.sql`: database integration assertions in a rolled-back transaction.
- `public/images/`: generated demo imagery; `public/fonts/`: locally hosted DM Sans and DM Serif Display (OFL).

## Verification

```bash
npm run typecheck
npm test
npm run build
```

Run `tests/rls.sql` in a disposable dev database or SQL Editor with an unused owner slot. The script creates fixtures only inside a transaction and rolls them back. It checks public reads, draft privacy, owner writes, non-owner denial and storage upload policies. It intentionally assumes no real owner has been provisioned yet.

Reduced-motion preferences disable parallax and smooth scrolling. All main navigation and content remain available on mobile. Touch devices use the same project and contact routes.

## New Supabase project

Apply migrations in timestamp order and insert one profile row (`id=1`). Add your own projects through the dashboard after provisioning the owner. Use a publishable key, never a secret/service-role key in the browser or repository. Set Auth Site URL and redirect URLs to your actual deployment origin.

## Deployment

Import the GitHub repository into Vercel, choose the Next.js preset and set the three environment variables from `.env.example`. Run the first-owner setup before using `/dashboard`. No website has been publicly deployed by this implementation step.
