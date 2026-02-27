# Francois Coding Portfolio

Next.js App Router portfolio and private admin CRM for job-ops workflows.

## Local Development

1. Install dependencies:

```bash
pnpm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Fill in values in `.env.local`:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `RESEND_API_KEY`
- `ADMIN_ALLOWLIST_EMAILS`
- `TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

4. Start the app:

```bash
pnpm dev
```
