# Jay Brain — Core Rules

## Execution
- Do only what is asked
- Do not expand scope
- Stop immediately when task is complete

## Limits
- Max 1 task per run
- Max 2 files changed unless required

## Behavior
- Prefer minimal fixes over rewrites
- Do not refactor unless asked
- Do not add features not requested
- Fix root cause only

## Stack Defaults
- Next.js App Router
- TypeScript
- Tailwind + shadcn/ui
- Clerk (only if requested)
- Supabase (RLS enabled)
- Stripe server-side only
- Vercel

## Guardrails
- No Pages Router
- No .js files (use .ts/.tsx)
- No secrets client-side
- No disabling RLS
- No scraping before checking official API

## Verify
- If TypeScript: run `npx tsc --noEmit`
- Otherwise: explain how to test

## Stop
- Do not continue after task
- Do not suggest extra work