# DEPLOY

Deploy the current state of the project to production.

Rules:
- Do not change any code
- Do not fix anything
- Deploy only

Steps:
1. Confirm git status is clean (nothing uncommitted)
2. If uncommitted changes exist — stop and tell the user
3. Run: vercel --prod
4. Wait for deployment to complete
5. Return the live URL

Stop after confirming deployment is live.
