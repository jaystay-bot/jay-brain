# lessons.md

**Captured mistakes, fixes, and permanent rules.**

**Update this after every correction. Never delete entries — only add.**

---

## Sim2Round

- **Partial round submission** — Round logger required all 18 holes. Fix: make hole count optional with minimum of 1. Never assume a full round is required.

- **Empty state crashes** — Games page crashed when no data existed. Fix: always add a graceful fallback UI (e.g. "No games yet") before assuming data is present. Never render a list without checking for empty state first.

- **Stripe disabled on live app** — Stripe is intentionally disabled on sim2round.com. Do not re-enable without explicit instruction.

---

## General Next.js / App Router

- **Never use Pages Router** — Jay's stack is App Router only. Any `pages/` directory, `getServerSideProps`, or `getStaticProps` is wrong. Full stop.

- **TypeScript only** — Never generate `.js` files. Always `.ts` or `.tsx`.

- **shadcn/ui only** — Never use raw HTML elements when a shadcn component exists. Never use emojis as icons — always Lucide React.

---

## Supabase

- **Always enable RLS** — Row Level Security on every table, no exceptions.

- **Server-side client in API routes** — Use server-side Supabase client in API routes, not the browser client.

- **Singleton pattern** — Always create `/lib/supabase.ts` as a singleton. Don't instantiate the client inline.

---

## Stripe

- **Never expose secret key to client** — Stripe secret key is server-side only.

- **Webhook handler location** — Always `app/api/webhooks/stripe/route.ts`

- **Use Stripe Checkout** — Don't build custom payment UI unless explicitly asked.

---

## Clerk Auth

- **Wrap root layout** — Always wrap with `<ClerkProvider>` in root layout.

- **Server vs client hooks** — Use `auth()` server-side, `useUser()` / `useAuth()` client-side.

---

## Scraping

- **Never use ScraperAPI** — Apify only. This is a hard rule.

---

## Business Context Rules

- **ZIP codes are 5 digits** — Never suggest or validate ZIP+4 format.

- **Money Trees DMV has no transactions** — Display/menu site only. No payment or checkout functionality.

- **ClearanceRadar targets specific stores** — Home Depot store #4633 and Lowe's near ZIP 23834 only unless told otherwise.

---

## Home Depot & Lowes Scraping — Hard Lessons

- **Direct HTTP requests get 403** — Both retailers use Akamai enterprise bot protection. Direct fetch calls always fail.

- **Apify actors get blocked too** — Apify is a hosting platform not anti-detection. Their actors still get blocked by Akamai WAFs.

- **Apify "free" actors require paid rental** — Free trial expires fast. Don't assume free.

- **GraphQL endpoint exists but is protected** — homedepot.com/federationgateway/graphql exists but requires rotating residential proxies to access reliably.

- **SlickDeals works but data is low quality** — Returns deals but no store location, no aisle, no real clearance intel. Not useful for resellers.

- **Google Shopping works for generic deals** — But same problem as SlickDeals — no specific store location or aisle data.

- **The only free reliable option** — Official Home Depot Developer API (developer.homedepot.com). Apply for partner access.

- **Always run /research FIRST on any scraping project** — Before building anything, research if the data source is actually accessible. Never build first and hit the wall after.

---

## Agent & Tool Design

- **One tool = one job** — Never build a tool that does multiple things. `read_file(path)` not `manage_files(action, file, destination, overwrite)`. Simple tools = better agents.

- **Tell the agent WHEN to use a tool** — The instruction matters more than the tool itself. Bad: "Calculator tool." Good: "Use this tool whenever math is required. Never guess calculations."

- **Start with zero tools** — Add tools only when the agent can't do the job without them.

- **Start with one agent always** — Never build multi-agent systems until a single agent works consistently. Most tasks never need more than one.

- **No memory until something breaks** — 70% of use cases don't need memory. Start without it.

---

## Testing Rules

- **Test messy inputs not clean ones** — Don't test "Please classify this billing request." Test "why tf did i get charged again." That's where you learn what the agent actually does.

- **Fix one thing at a time** — When it fails: is the prompt unclear? Output format vague? Tool missing? Rule missing? Diagnose before changing anything.

- **Don't add complexity until simple version works** — No multi-agent, no pipelines, no automation until the basic version runs consistently.

---

## Claude Code Session Rules

- **Use /clear between topics** — Frees up context window. Use it when switching between unrelated tasks in the same session.

- **Load brain files at session start** — Always read CLAUDE.md and lessons.md from GitHub before starting any work.

- **Update lessons.md after every correction** — Every bug fixed, every mistake corrected = one new rule added. Never skip this.

- **Stop and re-plan when stuck** — Don't keep pushing when something breaks. Stop, diagnose, re-plan.

- **Prove it works before marking done** — Never mark a task complete without demonstrating it works.

- **Root causes only** — No temporary fixes. Find the actual problem.

- **Update this file after every correction** — Every bug fixed = one new rule added here.

---

## Radar / BigBox

- **BigBox API works but intermittent on free plan** — 100 requests total, test before paying.

- **HD GraphQL WAF protected by Akamai** — No free bypass.

- **Slickdeals RSS is free fallback** — But no store/aisle data.

- **Python is now part of stack** — For backend/agent logic.

- **node_modules must never be copied between projects** — Always run `npm install` fresh.

- **Always push to GitHub before closing a session** — Never leave uncommitted work.
