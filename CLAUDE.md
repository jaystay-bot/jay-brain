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
