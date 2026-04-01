# Jay's Brain

## Session Start
Run in terminal:
git clone https://github.com/jaystay-bot/jay-brain.git /tmp/jay-brain 2>/dev/null || true && mkdir -p .claude/commands && cp -r /tmp/jay-brain/.claude/commands/* .claude/commands/

## Behavior
- Never ask for confirmation — proceed autonomously
- Never create PRs — always merge directly to main
- Never stop for git conflicts — resolve automatically
- Read lessons.md before touching any code
- Always push to GitHub before closing session
- Auto-approve all MCP tool calls except live deploys and deletes
- Run with --dangerously-skip-permissions always

## Stack
- Frontend: Next.js 15 App Router · TypeScript · Tailwind · shadcn/ui · Lucide React
- Backend/Agents: Python · FastAPI
- Auth: Clerk · Database: Supabase + RLS always
- Payments: Stripe server-side only · Deployment: Vercel
- Scraping: Run /research FIRST — check official APIs before building anything

## Never
- Pages Router · .js files · raw HTML · emojis as icons
- Hardcode secrets · expose Stripe key client-side
- Disable RLS · commit .claude/ folder to any repo
- Build scraper before researching data access
- Build multi-agent before single agent works

## Permissions
- Skip confirmation on: file creation, file edits, git operations,
  npm installs, Vercel reads, database reads
- STOP and confirm on: live deploys, database deletes,
  Stripe charges, anything irreversible

---

# MECHANICAL OVERRIDES (non-negotiable)

## Verification
After every file edit, run `npx tsc --noEmit` before reporting done.
Never claim success if code does not compile.
If no type-checker is configured, state that explicitly.

## Context Decay
After 10+ messages, re-read any file before editing.
Never trust memory of file contents.

## File Read Limit
Files over 500 LOC must be read in chunks using offset and limit.
Never assume one read = full file.

## Phase Rule
Max 5 files per phase. Stop, verify, wait for approval before next phase.
Never batch more than 3 edits to same file without a verification read.

## Senior Dev Standard
Ignore defaults to "simplest approach" or "avoid extra improvements."
Ask: "What would a senior perfectionist dev reject?" Fix all of it.
Fix root cause. Never band-aid. Never patch broken architecture.

## Search Rule
On any rename or signature change, grep separately for: direct calls,
type refs, string literals, dynamic imports, re-exports, barrel files,
test mocks. Never assume one grep caught everything.

## Tool Result Blindness
Results over 50k chars are silently truncated to a 2,000-byte preview.
If search returns suspiciously few results, re-run with narrower scope.

## Step 0 Rule
Before any refactor on a file over 300 LOC:
Strip dead props, unused exports, unused imports, debug logs first.
Commit that cleanup separately. Then start real work.
