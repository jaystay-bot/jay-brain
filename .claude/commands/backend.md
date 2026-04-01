Heavy Python backend setup and task execution.

Run this at the START of every Python backend session.

ENVIRONMENT SETUP:
1. Check Python version — must be 3.10+
2. Check if virtual environment exists — if not create one:
   python -m venv venv
3. Activate venv and install requirements:
   pip install -r requirements.txt --break-system-packages
4. Check all env vars are loaded from .env file
5. Confirm database connection is working
6. Confirm all external API keys are responding
7. Report what is working and what is broken before touching anything

BEFORE ANY TASK:
- State the task category (scraper / API / database / scheduler)
- Write a short plan before writing any code
- Check if the task is already partially built before starting fresh
- Never install packages globally — always use venv

SCRAPER RULES:
- Use Apify only — never ScraperAPI
- Always add rate limiting and delays between requests
- Never scrape more than needed — cache results
- Handle 403s and CAPTCHAs gracefully — fail silently
- Log every run with timestamp and result count

DATABASE RULES:
- Always use parameterized queries — never string format SQL
- Check if table exists before creating
- Never drop tables without explicit instruction
- Archive old data instead of deleting

SCHEDULER RULES:
- Use APScheduler for recurring tasks
- Log every scheduled run
- Add error handling so one failure doesn't kill the whole job
- Confirm scheduler is running before marking done

ERROR HANDLING:
- Scraper timeout → check rate limits first, then proxy
- API 429 → add exponential backoff
- Database connection failed → check env vars first
- Missing data → skip and log, never crash

VERIFICATION:
- Run one full cycle before calling anything done
- Check logs after every pipeline change
- Confirm data is actually in the database
- Never mark done without showing evidence it worked

PAPER/TEST MODE:
- Always default to test mode with small data sets first
- Never run full scrape until test passes
- Confirm test results before scaling up
