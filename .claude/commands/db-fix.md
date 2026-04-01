# /db-fix — Universal Supabase RLS Emergency Fix

Run any time saves fail with "Could not save" or "Sign in required" on any project.

## Step 1 — Find the Supabase project ID
Check .env.local for NEXT_PUBLIC_SUPABASE_URL
Extract the ref (subdomain before .supabase.co)
Example: https://evfyxxbz.supabase.co → ref is evfyxxbz

## Step 2 — Check existing RLS policies
Use Supabase MCP execute_sql:
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';

If empty → RLS is on but no policies exist → all writes blocked → go to Step 3

## Step 3 — Open all policies instantly
For each table run via Supabase MCP apply_migration:
CREATE POLICY "Allow all [table] operations"
ON public.[table]
FOR ALL USING (true) WITH CHECK (true);

No deployment needed. Takes effect immediately.

## Step 4 — Verify
Test saving in the app right after.
Check Vercel runtime logs for remaining errors.

## Step 5 — Add to lessons.md
"RLS enabled with no policies = 100% silent write failure.
Always create policies immediately after enabling RLS.
Use /db-fix to recover instantly via Supabase MCP."

## GOLDEN RULE
Never enable RLS without creating policies in the same migration.
