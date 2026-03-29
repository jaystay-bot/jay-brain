export interface Store {
  retailer: "home_depot" | "lowes";
  storeNumber: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  phone?: string;
}

export interface Deal {
  storeName: string;
  storeAddress: string;
  retailer: "home_depot" | "lowes";
  storeNumber: string;
  distanceMiles: number;
  productName: string;
  originalPrice: number;
  salePrice: number;
  discountPct: number;
  productUrl: string;
  category?: string;
  scannedAt: string;
}

export interface ScanResult {
  deals: Deal[];
  errors: string[];
  scannedAt: string;
  zip: string;
  radiusMiles: number;
  storesScanned: number;
  isPro?: boolean;
}

/** Parse a US price string like "$1,234.50" to a number. Returns 0 on failure. */
export function parsePrice(text: string): number {
  // Remove everything except digits, commas, dots
  const cleaned = text.replace(/[^0-9.,]/g, "");
  // Remove commas (US thousand separators)
  const noCommas = cleaned.replace(/,/g, "");
  // Ensure only one decimal point remains
  const parts = noCommas.split(".");
  if (parts.length > 2) {
    // Multiple dots — take first and last as decimal: "10..50" → "10.50"
    const whole = parts.slice(0, -1).join("");
    const decimal = parts[parts.length - 1];
    const price = parseFloat(`${whole}.${decimal}`);
    return isNaN(price) ? 0 : price;
  }
  const price = parseFloat(noCommas);
  return isNaN(price) || price < 0 ? 0 : price;
}
