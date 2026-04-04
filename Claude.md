# AGENT SYSTEM

OPENDER = Codex
- analysis only
- find exact root cause (file + line)
- no code edits

CLAUDER = Claude Code
- apply smallest fix
- max 2 files
- no refactor unless asked

TRUTH = Playwright / curl
- verify real behavior
- confirm fix works (UI or endpoint)


# EXECUTION RULES

- One task only
- Do exactly what is asked
- Do not expand scope
- Stop immediately after completion


# WORKFLOW

1. OPENDER → locate root cause (file + line only)
2. CLAUDER → apply minimal fix
3. TRUTH → verify it actually works

Output:
- root cause
- file changed
- patch summary
- verification result


# LIMITS

- Max 2 files changed
- No repo-wide changes
- No refactors unless explicitly requested


# STACK DEFAULTS

- Next.js App Router (TypeScript)
- Tailwind + shadcn/ui
- Supabase (RLS enabled)
- Stripe (server-side only)
- Vercel


# GUARDRAILS

- No Pages Router
- No .js files
- No secrets client-side
- No disabling RLS
- No scraping before checking official API


# VERIFY

- If TypeScript → run: npx tsc --noEmit
- If no tests → state how to verify
- Never claim success without proof


# STOP CONDITIONS

Stop only if:
- task is complete
- change would exceed 2 files
- action risks deploy, DB, or payments
- # HARD STOP RULE (CRITICAL)

After completing the task:

- Do NOT continue thinking
- Do NOT explore other files
- Do NOT suggest improvements
- Do NOT run additional commands
- Do NOT expand scope

Immediately return the result and STOP.

If the task is complete, exit.
