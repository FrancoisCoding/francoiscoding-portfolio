# Francois Coding Portfolio

Modern Next.js portfolio for Isaiah Francois plus a private admin job-ops CRM
with approval-only outreach workflows.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn-style UI primitives
- Framer Motion
- Supabase Auth
- Supabase Postgres + Prisma ORM
- TanStack Query + Jotai (admin state/data)
- Resend (contact + approved outreach send)
- Playwright smoke tests

## Architecture Overview

### Public Site

- Routes: `/`, `/projects`, `/experience`, `/about`, `/resume`, `/contact`
- Recruiter-first sections and FinanceFlow emphasis
- Contact form with Zod validation, Turnstile verification, and in-memory rate
  limit
- SEO metadata, OpenGraph image route, sitemap, and robots

### Private Admin

- Routes: `/admin`, `/admin/leads`, `/admin/templates`, `/admin/drafts`,
  `/admin/settings`
- Supabase login + allowlist enforcement via `ADMIN_ALLOWLIST_EMAILS`
- Leads CRUD + CSV import/export
- Templates CRUD with variable helper and live preview
- Draft generation flow: lead + template + optional highlight notes
- Approval-only sending: `QUEUED -> APPROVED -> SENT`
- Send throttles: max daily cap + per-minute cap
- Audit logs for generate, approve, and send

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `RESEND_API_KEY`
- `ADMIN_ALLOWLIST_EMAILS`
- `ADMIN_MAX_SENDS_PER_DAY`
- `TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `OPENAI_API_KEY` (optional)
- `CALENDLY_API_TOKEN` (optional, enables live scheduling)
- `CALENDLY_EVENT_TYPE_URI` (optional, enables live scheduling)
- `CALENDLY_EVENT_LABEL` (optional)
- `NEXT_PUBLIC_CALENDLY_TIMEZONE` (recommended, defaults to `America/New_York`)

## Local Development

1. Install dependencies:

```bash
pnpm install
```

2. Configure env:

```bash
cp .env.example .env.local
```

3. Generate Prisma client:

```bash
pnpm prisma:generate
```

4. Run migrations against your configured database:

```bash
pnpm prisma:migrate:dev
```

5. Start the app:

```bash
pnpm dev
```

## Supabase Setup

1. Create a Supabase project.
2. Add URL + anon key to `.env.local`.
3. Create admin users in Supabase Auth.
4. Set `ADMIN_ALLOWLIST_EMAILS` to the exact admin emails.
5. Ensure email/password sign-in is enabled for admin login flow.

## Prisma + Database

- Prisma schema: `prisma/schema.prisma`
- Migration files: `prisma/migrations/*`
- Deploy migrations in CI/CD with:

```bash
pnpm prisma:migrate
```

## Testing

Run quality checks:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Run Playwright smoke tests:

```bash
pnpm test:e2e
```

## CI Overview

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on push/PR to `main`:

1. Install dependencies
2. Lint
3. Typecheck
4. Unit test step (auto-skips when no unit test script exists)
5. Build
6. Playwright smoke tests (Chromium)

## Deploy Notes

- Configure all required env vars in your hosting provider.
- Set production Supabase and Postgres values.
- Apply Prisma migrations during deploy.
- Configure Turnstile site/secret keys for production spam protection.
- Configure Resend API key and verified sender domain for production outreach.
