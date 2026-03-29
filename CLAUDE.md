# Clearance Deal Scanner

## Project
Next.js 15 + TypeScript app that scans Home Depot & Lowes clearance sections near a user's ZIP code.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Auth**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe ($15/mo Pro)
- **Scraping**: Axios + Cheerio
- **Geocoding**: us-zips (offline)
- **Notifications**: Telegram Bot API

## Key Directories
- `src/app/` — Pages and API routes
- `src/lib/` — Core logic (scrapers, geo, cache, stripe, telegram)
- `src/lib/scrapers/` — Home Depot and Lowes scrapers
- `src/components/` — React components
- `tasks/` — Specs and todos

## Rules
- Free tier: 3 scans/day, view only
- Pro tier: unlimited scans, CSV export, Telegram alerts
- Cache deal results for 24 hours
- Rate-limit scraping: 1 req/sec per retailer domain
- Always validate ZIP codes (5-digit US only)
- Never store payment info — Stripe handles billing
