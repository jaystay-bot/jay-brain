# AGENT SYSTEM

OPENDER = Codex
- Analysis only
- Find exact root cause (file + line)
- No code edits
- Do NOT guess

CLAUDER = Claude Code
- Apply smallest possible fix
- Max 2 files
- No refactor unless explicitly asked
- Do exactly what is requested

TRUTH = Playwright / curl
- Verify real behavior (UI or API)
- Confirm fix actually works
- No assumptions


# EXECUTION RULES

- One task only
- Do exactly what is asked
- Do not expand scope
- Do NOT guess root cause
- If root cause is unclear → continue analyzing until exact cause is found


# WORKFLOW

- Always follow this order strictly
- Do NOT skip steps
- Do NOT combine roles

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


# FAIL CONDITION

If verification fails:
- Do NOT attempt another fix
- Return failure clearly
- Wait for new task


# HARD STOP RULE (CRITICAL)

After completing the task:

- Do NOT continue thinking
- Do NOT explore other files
- Do NOT suggest improvements
- Do NOT run additional commands
- Do NOT expand scope

Immediately return the result and STOP.

If the task is complete, exit.

Make short for clauder you know him 
