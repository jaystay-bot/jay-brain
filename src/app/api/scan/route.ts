import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { geocodeZip, isValidZip, haversineDistance } from "@/lib/geo";
import {
  findHomeDepotStores,
  scrapeHomeDepotClearance,
} from "@/lib/scrapers/home-depot";
import { findLowesStores, scrapeLowesClearance } from "@/lib/scrapers/lowes";
import {
  getCachedDeals,
  cacheDeals,
  recordScan,
  getScanCount,
} from "@/lib/cache";
import { isProSubscriber } from "@/lib/stripe";
import { Deal, ScanResult } from "@/lib/scrapers/types";

const FREE_DAILY_LIMIT = 3;
const DEFAULT_RADIUS = 50;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const zip = body.zip?.trim();

    if (!zip || !isValidZip(zip)) {
      return NextResponse.json(
        { error: "Invalid ZIP code. Please enter a valid 5-digit US ZIP." },
        { status: 400 }
      );
    }

    const radiusMiles = Math.min(body.radius || DEFAULT_RADIUS, DEFAULT_RADIUS);

    // Check rate limit for free users
    const isPro = await isProSubscriber(body.email || "");
    if (!isPro) {
      const scanCount = await getScanCount(userId);
      if (scanCount >= FREE_DAILY_LIMIT) {
        return NextResponse.json(
          {
            error: `Free users are limited to ${FREE_DAILY_LIMIT} scans per day. Upgrade to Pro for unlimited scans.`,
            upgradeRequired: true,
          },
          { status: 429 }
        );
      }
    }

    // Geocode ZIP
    const location = geocodeZip(zip);
    if (!location) {
      return NextResponse.json(
        { error: "Could not geocode ZIP code." },
        { status: 400 }
      );
    }

    const { lat, lng } = location;
    const errors: string[] = [];
    let allDeals: Deal[] = [];

    // Find stores from both retailers in parallel
    const [hdStores, lowesStores] = await Promise.all([
      findHomeDepotStores(lat, lng, radiusMiles).catch((e) => {
        errors.push(`Home Depot store lookup failed: ${e.message}`);
        return [];
      }),
      findLowesStores(lat, lng, radiusMiles).catch((e) => {
        errors.push(`Lowes store lookup failed: ${e.message}`);
        return [];
      }),
    ]);

    const allStores = [...hdStores, ...lowesStores];

    // Scrape clearance for each store (check cache first)
    for (const store of allStores) {
      const cached = await getCachedDeals(store.storeNumber, store.retailer);
      if (cached) {
        allDeals.push(...cached);
        continue;
      }

      try {
        const deals =
          store.retailer === "home_depot"
            ? await scrapeHomeDepotClearance(store)
            : await scrapeLowesClearance(store);

        if (deals.length > 0) {
          await cacheDeals(deals);
        }
        allDeals.push(...deals);
      } catch (e) {
        const err = e as Error;
        errors.push(
          `Failed to scrape ${store.retailer} store ${store.storeNumber}: ${err.message}`
        );
      }
    }

    // Calculate distances and sort
    allDeals = allDeals.map((deal) => {
      const store = allStores.find(
        (s) =>
          s.storeNumber === deal.storeNumber && s.retailer === deal.retailer
      );
      return {
        ...deal,
        distanceMiles: store
          ? haversineDistance(lat, lng, store.lat, store.lng)
          : 0,
      };
    });

    // Sort by discount % descending
    allDeals.sort((a, b) => b.discountPct - a.discountPct);

    // Record scan
    await recordScan(userId, zip, radiusMiles);

    const result: ScanResult = {
      deals: allDeals,
      errors,
      scannedAt: new Date().toISOString(),
      zip,
      radiusMiles,
      storesScanned: allStores.length,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
