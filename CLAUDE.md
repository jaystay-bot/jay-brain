# CLAUDE.md — Jay's Universal Brain
# This file lives in jay-brain only. It applies to every project.
# Never put project-specific rules here.

---

## HOW TO LOAD THIS BRAIN

At the start of every Claude Code session:
1. Read this file from jay-brain
2. Read lessons.md from jay-brain
3. Then begin the task

---

## MCP WORKFLOW

Use claude.ai BEFORE Claude Code for all service setup.

claude.ai handles external services directly via MCP:
- Stripe → create products, prices, payment links
- Vercel → check deployments, read runtime logs
- Supabase → database management, schema changes
- Clerk → user management
- Gmail → check emails, confirmations

Workflow every project:
1. claude.ai → set up Stripe product + price via MCP
2. claude.ai → check Vercel logs for errors
3. Claude Code → write and fix code
4. Push to GitHub → Vercel auto deploys
5. claude.ai → verify deployment succeeded

RULE: Never manage Stripe, Vercel, or Supabase from inside Claude Code. Claude Code writes code only.

---

## CAPABILITY ROUTER

Classify every task before solving it.

1. Library & API Reference — docs, SDKs, endpoints, auth
2. Product Verification — QA, pipeline check, feature confirm, logic test
3. Data & Analysis — hit rates, conversion, metrics, follow-through
4. Business Automation — schedulers, alerts, digests, workflows
5. Scaffolding & Templates — new page, new table, new component, boilerplate
6. Code Quality & Review — logic review, architecture critique, refactor
7. CI/CD & Deployment — deploy, env vars, mode toggle, secrets
8. Incident Runbooks — timeout, bug, feature not working, debug
9. Infrastructure Ops — DB cleanup, pruning, rate limits, cost control

For every task: state category → confirm why → then solve

---

## EXECUTION OS

Before any task:
- State the category
- Write a short plan before writing any code
- If path is unclear: stop, re-plan, then proceed

Verification standard:
- Never call a feature done without confirming it works
- Check logs after every change
- Prove it works before marking done
- Show evidence before marking complete

Session rules:
- Use /clear between unrelated topics
- Stop and re-plan when stuck — never keep pushing through a broken state
- Root causes only — no temporary fixes unless labeled TEMPORARY
- Always push to GitHub before closing a session

---

## HARD STACK RULES

**Next.js**
- App Router only — never Pages Router
- Never use getServerSideProps or getStaticProps
- Never create a pages/ directory

**TypeScript**
- Always .ts or .tsx — never .js files

**UI Components**
- shadcn/ui only — never raw HTML when a shadcn component exists
- Never use emojis as icons — always Lucide React

**Supabase**
- Always enable RLS — Row Level Security on every table, no exceptions
- Server-side Supabase client in API routes — never browser client
- Always create /lib/supabase.ts as a singleton — never instantiate inline

**Stripe**
- Never expose secret key to client — server-side only
- Webhook handler always at app/api/webhooks/stripe/route.ts
- Always use Stripe Checkout — never build custom payment UI unless explicitly asked
- Never store payment info — Stripe handles all billing

**Clerk**
- Always wrap root layout with ClerkProvider
- Use auth() server-side, useUser() / useAuth() client-side

**Scraping**
- Never use ScraperAPI — Apify only
- Always run /research FIRST before building any scraper
- Never build first and hit the wall after — research data access before writing code
- Direct HTTP requests to Home Depot and Lowes always fail — Akamai WAF blocks them

**Environment**
- Never hardcode secrets or API keys — env vars only
- node_modules must never be copied between projects — always run npm install fresh

---

## AGENT & TOOL DESIGN RULES

- One tool = one job — never build a tool that does multiple things
- Tell the agent WHEN to use a tool — the instruction matters more than the tool
- Start with zero tools — add only when the agent cannot do the job without them
- Start with one agent always — never build multi-agent until single agent works
- No memory until something breaks — most tasks never need it

---

## TESTING RULES

- Test messy inputs not clean ones — test real user behavior not ideal input
- Fix one thing at a time — diagnose before changing anything
- Never add complexity until the simple version works consistently

---

## LESSONS LEARNED

See lessons.md in jay-brain for the full running list.
Read it every session. Never skip it.
