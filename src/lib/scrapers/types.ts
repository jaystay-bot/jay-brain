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
}
