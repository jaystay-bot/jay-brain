import axios from "axios";
import * as cheerio from "cheerio";
import { Store, Deal } from "./types";

const STORE_LOCATOR_URL =
  "https://www.lowes.com/store/api/search";

const RATE_LIMIT_MS = 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function findLowesStores(
  lat: number,
  lng: number,
  radiusMiles: number
): Promise<Store[]> {
  try {
    const res = await axios.get(STORE_LOCATOR_URL, {
      params: {
        latitude: lat,
        longitude: lng,
        maxResults: 20,
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
    const storeList = res.data?.storeListResponse?.stores || res.data?.stores || [];

    for (const s of storeList) {
      stores.push({
        retailer: "lowes",
        storeNumber: String(s.storeNumber || s.id || s.storeId),
        name: s.name || `Lowes #${s.storeNumber}`,
        address: s.address || s.streetAddress || "",
        city: s.city || "",
        state: s.state || "",
        zip: s.zip || s.postalCode || "",
        lat: parseFloat(s.latitude || s.lat || 0),
        lng: parseFloat(s.longitude || s.lng || 0),
        phone: s.phone || "",
      });
    }

    return stores;
  } catch (error) {
    console.error("Lowes store locator error:", error);
    return [];
  }
}

export async function scrapeLowesClearance(
  store: Store
): Promise<Deal[]> {
  const deals: Deal[] = [];
  const clearanceUrl = `https://www.lowes.com/search?searchTerm=clearance&offset=0&storeNumber=${store.storeNumber}&sortMethod=sortBy_priceLowToHigh`;

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

    // Parse product cards from Lowes search results
    $(
      "[data-testid='product-card'], .plp-card, .product-card"
    ).each((_i, el) => {
      const $el = $(el);
      const productName =
        $el
          .find(
            "[data-testid='product-title'] a, .product-title a, .card-header-title a"
          )
          .text()
          .trim() || "Unknown Product";

      const productUrl =
        $el
          .find(
            "[data-testid='product-title'] a, .product-title a, .card-header-title a"
          )
          .attr("href") || "";

      const originalPriceText =
        $el
          .find(".strike-through, .was-price, del, [data-testid='was-price']")
          .text()
          .trim() || "";
      const salePriceText =
        $el
          .find(
            "[data-testid='sale-price'], .current-price, .art-plp-price"
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
          retailer: "lowes",
          storeNumber: store.storeNumber,
          distanceMiles: 0,
          productName,
          originalPrice,
          salePrice,
          discountPct,
          productUrl: productUrl.startsWith("http")
            ? productUrl
            : `https://www.lowes.com${productUrl}`,
          scannedAt: new Date().toISOString(),
        });
      }
    });
  } catch (error) {
    console.error(
      `Lowes clearance scrape error for store ${store.storeNumber}:`,
      error
    );
  }

  return deals;
}

function parsePrice(text: string): number {
  const match = text.replace(/[^0-9.]/g, "");
  const price = parseFloat(match);
  return isNaN(price) ? 0 : price;
}
