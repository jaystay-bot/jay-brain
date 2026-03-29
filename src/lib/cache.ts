import { supabase } from "./supabase";
import { Deal, Store } from "./scrapers/types";

const CACHE_TTL_HOURS = 24;

export async function getCachedDeals(
  storeNumber: string,
  retailer: string
): Promise<Deal[] | null> {
  const cutoff = new Date(
    Date.now() - CACHE_TTL_HOURS * 60 * 60 * 1000
  ).toISOString();

  const { data } = await supabase
    .from("deals")
    .select("*")
    .eq("store_number", storeNumber)
    .eq("retailer", retailer)
    .gte("scanned_at", cutoff);

  if (!data || data.length === 0) return null;

  return data.map((row) => ({
    storeName: row.store_name,
    storeAddress: row.store_address,
    retailer: row.retailer,
    storeNumber: row.store_number,
    distanceMiles: 0, // calculated later
    productName: row.product_name,
    originalPrice: row.original_price,
    salePrice: row.sale_price,
    discountPct: row.discount_pct,
    productUrl: row.product_url,
    category: row.category,
    scannedAt: row.scanned_at,
  }));
}

export async function cacheDeals(deals: Deal[]): Promise<void> {
  if (deals.length === 0) return;

  const rows = deals.map((d) => ({
    store_number: d.storeNumber,
    retailer: d.retailer,
    store_name: d.storeName,
    store_address: d.storeAddress,
    product_name: d.productName,
    product_url: d.productUrl,
    original_price: d.originalPrice,
    sale_price: d.salePrice,
    discount_pct: d.discountPct,
    category: d.category || null,
    scanned_at: d.scannedAt,
    expires_at: new Date(
      Date.now() + CACHE_TTL_HOURS * 60 * 60 * 1000
    ).toISOString(),
  }));

  await supabase.from("deals").upsert(rows, {
    onConflict: "store_number,retailer,product_name",
  });
}

export async function getCachedStores(
  retailer: string,
  lat: number,
  lng: number,
  radiusMiles: number
): Promise<Store[] | null> {
  // Simple bounding box check - 1 degree ≈ 69 miles
  const latDelta = radiusMiles / 69;
  const lngDelta = radiusMiles / (69 * Math.cos((lat * Math.PI) / 180));

  const { data } = await supabase
    .from("stores")
    .select("*")
    .eq("retailer", retailer)
    .gte("lat", lat - latDelta)
    .lte("lat", lat + latDelta)
    .gte("lng", lng - lngDelta)
    .lte("lng", lng + lngDelta);

  if (!data || data.length === 0) return null;

  return data.map((row) => ({
    retailer: row.retailer,
    storeNumber: row.store_number,
    name: row.name,
    address: row.address,
    city: row.city,
    state: row.state,
    zip: row.zip,
    lat: row.lat,
    lng: row.lng,
  }));
}

export async function cacheStores(stores: Store[]): Promise<void> {
  if (stores.length === 0) return;

  const rows = stores.map((s) => ({
    retailer: s.retailer,
    store_number: s.storeNumber,
    name: s.name,
    address: s.address,
    city: s.city,
    state: s.state,
    zip: s.zip,
    lat: s.lat,
    lng: s.lng,
    updated_at: new Date().toISOString(),
  }));

  await supabase.from("stores").upsert(rows, {
    onConflict: "retailer,store_number",
  });
}

/**
 * Atomically record a scan and return the updated daily count.
 * This prevents the race condition where two concurrent requests
 * both read count=2 and both proceed past the limit.
 */
export async function recordScanAndGetCount(
  userId: string,
  zip: string,
  radiusMiles: number
): Promise<number> {
  const now = new Date().toISOString();
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  // Insert the scan first
  await supabase.from("scans").insert({
    user_id: userId,
    zip_code: zip,
    radius_miles: radiusMiles,
    created_at: now,
  });

  // Then count (includes the one we just inserted)
  const { count } = await supabase
    .from("scans")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", todayStart.toISOString());

  return count || 0;
}

export async function getScanCount(userId: string): Promise<number> {
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("scans")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", todayStart.toISOString());

  return count || 0;
}
