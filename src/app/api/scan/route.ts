import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { geocodeZip, isValidZip, haversineDistance } from "@/lib/geo";
import {
  findHomeDepotStores,
  scrapeHomeDepotClearance,
} from "@/lib/scrapers/home-depot";
import { findLowesStores, scrapeLowesClearance } from "@/lib/scrapers/lowes";
import {
  getCachedDeals,
  cacheDeals,
  recordScanAndGetCount,
  getScanCount,
} from "@/lib/cache";
import { isProSubscriber } from "@/lib/stripe";
import { Deal, ScanResult } from "@/lib/scrapers/types";

const FREE_DAILY_LIMIT = 3;
const DEFAULT_RADIUS = 50;
const MAX_DEALS_PER_RESPONSE = 500;

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

    // Clamp radius between 1 and 50 (fix: previously always returned 50)
    const radiusMiles = Math.max(1, Math.min(Number(body.radius) || DEFAULT_RADIUS, DEFAULT_RADIUS));

    // Use Clerk's authenticated email — never trust client-supplied email
    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress || "";

    const isPro = email ? await isProSubscriber(email) : false;

    // Check rate limit for free users before scanning
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
      findHomeDepotStores(lat, lng, radiusMiles).catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : "Unknown error";
        errors.push(`Home Depot store lookup failed: ${msg}`);
        return [];
      }),
      findLowesStores(lat, lng, radiusMiles).catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : "Unknown error";
        errors.push(`Lowes store lookup failed: ${msg}`);
        return [];
      }),
    ]);

    const allStores = [...hdStores, ...lowesStores];

    if (allStores.length === 0 && errors.length === 0) {
      // No stores found but no errors — tell user explicitly
      return NextResponse.json({
        deals: [],
        errors: [],
        scannedAt: new Date().toISOString(),
        zip,
        radiusMiles,
        storesScanned: 0,
      } satisfies ScanResult);
    }

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
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        errors.push(
          `Failed to scrape store ${store.storeNumber}: ${msg}`
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

    // Sort by discount % descending, cap results to prevent memory bloat
    allDeals.sort((a, b) => b.discountPct - a.discountPct);
    allDeals = allDeals.slice(0, MAX_DEALS_PER_RESPONSE);

    // Record scan atomically
    await recordScanAndGetCount(userId, zip, radiusMiles);

    const result: ScanResult = {
      deals: allDeals,
      errors,
      scannedAt: new Date().toISOString(),
      zip,
      radiusMiles,
      storesScanned: allStores.length,
      isPro,
    };

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Scan error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
