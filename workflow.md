# workflow.md — Jay's Build Workflow
# Add this to jay-brain. Read this when starting any session.

---

## STARTING A SESSION

Always in this order. No exceptions.

```
/brain        → loads CLAUDE.md + lessons.md
/env          → confirms all env vars are set
```

Then state what you're working on today.

---

## STARTING A NEW PROJECT

```
/brain        → load rules
/idea         → validate the idea first
/intercept    → research patterns, check what exists
/research     → if external API or scraper needed
/feature-dev  → build it
/test         → prove it works
/review       → code quality check
/ship         → pre-deploy checklist
/launch       → go live checklist
```

---

## ADDING A NEW FEATURE TO EXISTING PROJECT

```
/brain        → load rules
/intercept    → research before touching anything
/feature-dev  → build the feature
/test         → prove it works
/review       → check the code
/ship         → deploy
```

---

## FIXING A BUG

```
/brain        → load rules
/fix          → root cause protocol
/debug        → if logs needed to diagnose
/test         → confirm fix works
/commit       → commit fix + lesson
```

---

## ADDING PAYMENTS

```
/brain        → load rules
/stripe       → set up Stripe via claude.ai MCP first
/paywall      → add free vs pro gating in code
/test         → test checkout flow end to end
/ship         → deploy
```

---

## DATABASE CHANGES

```
/brain        → load rules
/db           → create table, enable RLS, write policies via MCP
/env          → confirm Supabase keys are set
/test         → confirm queries work and RLS blocks unauthorized access
```

---

## COMMAND REFERENCE

| Command | Job |
|---|---|
| `/brain` | Load CLAUDE.md + lessons.md — run FIRST every session |
| `/idea` | Validate a new idea before building |
| `/intercept` | Research patterns before touching any code |
| `/research` | Find and test real API endpoints |
| `/feature-dev` | Build a new feature |
| `/fix` | Fix a bug — root cause only |
| `/debug` | Systematic debug using logs |
| `/test` | Test the feature — messy inputs, edge cases |
| `/review` | Code quality and architecture check |
| `/refactor` | Clean up code without changing behavior |
| `/ship` | Pre-deploy checklist |
| `/commit` | Git commit protocol |
| `/launch` | Full go-live checklist |
| `/stripe` | Stripe setup via claude.ai MCP |
| `/paywall` | Add free vs pro tier gating |
| `/db` | Supabase table setup and RLS via claude.ai MCP |
| `/env` | Check all environment variables |
| `/docs` | Generate documentation |

---

## JAY'S STACK (every project)

- Framework: Next.js 15 App Router
- Language: TypeScript only
- Styling: Tailwind + shadcn/ui
- Auth: Clerk
- Database: Supabase + RLS always
- Payments: Stripe Checkout
- Deployment: Vercel via GitHub push
- Icons: Lucide React only

---

## GOLDEN RULES

- Never skip /brain at session start
- Never build before /intercept
- Never touch Stripe or Supabase from Claude Code — use claude.ai MCP
- Never ship without /test passing
- Always push to GitHub before closing session
- Always add to lessons.md when something breaks
