Run a full security and cost audit across all projects.

1. Check Vercel env vars — confirm all keys are set
2. Search codebase for any hardcoded API keys or secrets
3. Check Supabase RLS policies are correct on all tables
4. Check Stripe webhooks are healthy
5. Estimate monthly API costs at current usage:
   - Groq API calls
   - Odds API credits used
   - BallDontLie calls
6. Flag everything as HIGH / MEDIUM / LOW priority
Report findings clearly before fixing anything.
