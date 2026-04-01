# Jay Universal Brain

## Rule
Do only what is asked.
Do not expand scope.
Do not fix anything else.
Stop when done.

## Limits
- Max 1 task at a time
- Max 2 files changed unless explicitly required

## Stack
- Next.js App Router
- TypeScript
- Tailwind
- shadcn/ui
- Clerk
- Supabase with RLS
- Stripe server-side only
- Vercel

## Guardrails
- No Pages Router
- No .js when .ts/.tsx is expected
- No secrets client-side
- No disabling RLS

## Verify
- If TypeScript, run `npx tsc --noEmit`
- Otherwise explain how to test

## Stop
Do not continue after the task.
Do not suggest extra work unless asked.
