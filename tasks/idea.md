# Clearance Deal Scanner — Prompt 0 Spec

## One-Sentence Idea
A ZIP-code-based clearance deal scanner that finds nearby Home Depot and Lowes stores within 50 miles, scrapes their clearance inventory, and displays deals with store info, pricing, and discount percentages — with paid CSV export and Telegram alerts at $15/month.

---

## The 4 Questions

### 1. Outcome
User enters a ZIP code → sees a table of clearance deals from Home Depot and Lowes within 50 miles, sorted by discount %. Each row shows: store name, distance, product name, original price, sale price, discount %. Pro users can export to CSV and receive Telegram alerts when new deals appear.

### 2. Information Needed
- **User input**: ZIP code (5-digit US)
- **Store locations**: Home Depot & Lowes store locator APIs for stores within 50 miles
- **Clearance data**: Each store's clearance/markdown inventory (product name, original price, sale price)
- **Geocoding**: ZIP code → lat/lng for distance calculations
- **User auth**: Clerk session for login
- **Subscription status**: Stripe subscription state for pro features
- **Telegram chat ID**: For pro users who want alerts

### 3. Actions
1. Accept ZIP code input from user
2. Geocode ZIP to lat/lng coordinates
3. Query Home Depot & Lowes store locators for stores within 50 miles
4. For each store, scrape clearance section for marked-down items
5. Calculate distance from user ZIP to each store
6. Calculate discount %: `((original - sale) / original) * 100`
7. Cache results in Supabase (24h TTL)
8. Return sorted results (highest discount first)
9. **Pro only**: Generate CSV download
10. **Pro only**: Run scheduled scans + send Telegram alerts

### 4. Rules
- US ZIP codes only (5-digit, validated)
- Max radius: 50 miles
- Cache results 24 hours per store
- Free tier: view deals only, 3 scans/day
- Pro tier ($15/mo): unlimited scans, CSV export, Telegram alerts
- Stripe handles all billing — never store payment info
- Rate-limit scraping: 1 req/sec per domain
- Graceful partial failures — show what we have with error notice

---

## Agent Definition

| Field | Value |
|-------|-------|
| **Role** | Clearance Deal Scanner Agent |
| **Goal** | Find and return the best clearance deals from Home Depot and Lowes near a given ZIP code |
| **Tools** | Axios + Cheerio (scraping), Supabase (DB + cache), Stripe (billing), Telegram Bot API, us-zips (geocoding) |
| **Rules** | Cache 24h, rate-limit 1 req/sec, validate ZIP, enforce tier limits, sort by discount % desc |
| **Output** | JSON array: `{ storeName, storeAddress, distanceMiles, productName, originalPrice, salePrice, discountPct, productUrl, scannedAt }` |

---

## MVP Features (no extras)

1. ZIP code input + validation (5-digit US)
2. Store finder — HD & Lowes within 50 miles
3. Clearance scraper per store
4. Deal results table (store, distance, product, prices, discount %)
5. 24h caching in Supabase
6. Clerk auth (sign-up/login)
7. Stripe Pro subscription ($15/mo)
8. CSV export (Pro only)
9. Telegram alerts (Pro only)
10. Rate limiting (free: 3/day, pro: unlimited)

**NOT in MVP**: mobile app, price history, wishlist, more retailers, browser extension, social features.

---

## Complexity: Complex

- Two retailer scrapers (fragile, anti-bot, different structures)
- Geocoding + distance pipeline
- Scheduled background jobs for alerts
- Three external services (Clerk, Stripe, Telegram)
- Caching layer with TTL
- Two-tier access control

---

## MCP Servers Needed

| Server | Purpose |
|--------|---------|
| Supabase MCP | Database — users, deals cache, scan history, Telegram subs |
| Clerk MCP | Authentication and session management |
| Stripe MCP | Pro subscription billing + webhooks |

Telegram uses direct Bot API via HTTP (no MCP needed).

---

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Next.js (API routes + frontend)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Clerk
- **Payments**: Stripe
- **Scraping**: Axios + Cheerio
- **Geocoding**: us-zips (offline ZIP→lat/lng) + Haversine distance
- **Scheduling**: Vercel Cron or Supabase Edge Functions
- **Notifications**: Telegram Bot API

---

## Database Schema

```sql
stores (id, retailer, store_number, name, address, city, state, zip, lat, lng, updated_at)
deals (id, store_id, product_name, product_url, original_price, sale_price, discount_pct, category, scanned_at, expires_at)
scans (id, user_id, zip_code, radius_miles, created_at)
telegram_subs (id, user_id, chat_id, zip_code, radius_miles, is_active, created_at)
```

---

## API Routes

```
POST /api/scan            — Submit ZIP, get deals
GET  /api/deals/export    — CSV download (pro only)
POST /api/telegram/link   — Link Telegram chat ID
POST /api/webhooks/stripe — Stripe subscription webhooks
GET  /api/health          — Health check
```

---

## Status: APPROVED — Ready to build
