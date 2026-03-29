-- Stores cache
CREATE TABLE IF NOT EXISTS stores (
  id BIGSERIAL PRIMARY KEY,
  retailer TEXT NOT NULL,
  store_number TEXT NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (retailer, store_number)
);

-- Deals cache
CREATE TABLE IF NOT EXISTS deals (
  id BIGSERIAL PRIMARY KEY,
  store_number TEXT NOT NULL,
  retailer TEXT NOT NULL,
  store_name TEXT,
  store_address TEXT,
  product_name TEXT NOT NULL,
  product_url TEXT,
  original_price NUMERIC(10, 2),
  sale_price NUMERIC(10, 2),
  discount_pct NUMERIC(5, 1),
  category TEXT,
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE (store_number, retailer, product_name)
);

-- User scans (for rate limiting)
CREATE TABLE IF NOT EXISTS scans (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  radius_miles INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Telegram alert subscriptions
CREATE TABLE IF NOT EXISTS telegram_subs (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  chat_id TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  radius_miles INTEGER DEFAULT 50,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_deals_store ON deals (store_number, retailer);
CREATE INDEX IF NOT EXISTS idx_deals_scanned ON deals (scanned_at);
CREATE INDEX IF NOT EXISTS idx_scans_user_date ON scans (user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_stores_location ON stores (retailer, lat, lng);
CREATE INDEX IF NOT EXISTS idx_telegram_active ON telegram_subs (is_active) WHERE is_active = TRUE;
