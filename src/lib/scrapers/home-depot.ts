import axios from "axios";
import * as cheerio from "cheerio";
import { Store, Deal, parsePrice } from "./types";

const STORE_LOCATOR_URL =
  "https://www.homedepot.com/l/search";

const RATE_LIMIT_MS = 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function findHomeDepotStores(
  lat: number,
  lng: number,
  radiusMiles: number
): Promise<Store[]> {
  try {
    const res = await axios.get(STORE_LOCATOR_URL, {
      params: {
        latitude: lat,
        longitude: lng,
        radius: radiusMiles,
      },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
      timeout: 10000,
    });

    const stores: Store[] = [];
    const data = res.data;

    // Home Depot store locator returns JSON with stores array
    const storeList = data?.stores || data?.storeDirectory?.stores || [];

    for (const s of storeList) {
      const storeId = s.storeId || s.storeNumber || s.id;
      if (!storeId) continue; // skip entries with no ID
      stores.push({
        retailer: "home_depot",
        storeNumber: String(storeId),
        name: s.storeName || s.name || `Home Depot #${storeId}`,
        address: s.address?.street || s.streetAddress || "",
        city: s.address?.city || s.city || "",
        state: s.address?.state || s.state || "",
        zip: s.address?.postalCode || s.zip || "",
        lat: parseFloat(s.coordinates?.lat || s.latitude || 0),
        lng: parseFloat(s.coordinates?.lng || s.longitude || 0),
        phone: s.phone || "",
      });
    }

    return stores;
  } catch (error) {
    console.error("Home Depot store locator error:", error);
    return [];
  }
}

export async function scrapeHomeDepotClearance(
  store: Store
): Promise<Deal[]> {
  const deals: Deal[] = [];
  const clearanceUrl = `https://www.homedepot.com/b/Deals/N-5yc1vZc7qo?storeSelection=${store.storeNumber}&Nao=0`;

  try {
    await sleep(RATE_LIMIT_MS);

    const res = await axios.get(clearanceUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(res.data);

    // Parse product cards from clearance page
    $("[data-testid='product-pod'],.product-pod,.browse-search__pod").each(
      (_i, el) => {
        const $el = $(el);
        const productName =
          $el
            .find(
              "[data-testid='product-header'] a, .product-pod__title a, .pod-plp__description a"
            )
            .text()
            .trim() || "Unknown Product";

        const productUrl =
          $el
            .find(
              "[data-testid='product-header'] a, .product-pod__title a, .pod-plp__description a"
            )
            .attr("href") || "";

        const originalPriceText =
          $el
            .find(".price-detailed__was-price, .price__was, del")
            .text()
            .trim() || "";
        const salePriceText =
          $el
            .find(
              ".price-detailed__main-price, .price__main, .price-format__main-price"
            )
            .text()
            .trim() || "";

        const originalPrice = parsePrice(originalPriceText);
        const salePrice = parsePrice(salePriceText);

        if (originalPrice > 0 && salePrice > 0 && salePrice < originalPrice) {
          const discountPct =
            Math.round(
              ((originalPrice - salePrice) / originalPrice) * 1000
            ) / 10;

          deals.push({
            storeName: store.name,
            storeAddress: `${store.address}, ${store.city}, ${store.state} ${store.zip}`,
            retailer: "home_depot",
            storeNumber: store.storeNumber,
            distanceMiles: 0,
            productName,
            originalPrice,
            salePrice,
            discountPct,
            productUrl: sanitizeProductUrl(productUrl, "https://www.homedepot.com"),
            scannedAt: new Date().toISOString(),
          });
        }
      }
    );
  } catch (error) {
    console.error(
      `Home Depot clearance scrape error for store ${store.storeNumber}:`,
      error
    );
  }

  return deals;
}

function sanitizeProductUrl(url: string, baseUrl: string): string {
  if (!url) return "";
  const full = url.startsWith("http") ? url : `${baseUrl}${url}`;
  try {
    const parsed = new URL(full);
    // Only allow URLs from expected retailer domain
    if (!parsed.hostname.endsWith("homedepot.com")) return "";
    return parsed.toString();
  } catch {
    return "";
  }
}

