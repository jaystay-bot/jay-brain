import { Deal } from "./scrapers/types";

export function dealsToCSV(deals: Deal[]): string {
  const headers = [
    "Store Name",
    "Retailer",
    "Store Address",
    "Distance (miles)",
    "Product Name",
    "Original Price",
    "Sale Price",
    "Discount %",
    "Product URL",
    "Scanned At",
  ];

  const rows = deals.map((d) => [
    escapeCSV(d.storeName),
    d.retailer === "home_depot" ? "Home Depot" : "Lowes",
    escapeCSV(d.storeAddress),
    d.distanceMiles.toString(),
    escapeCSV(d.productName),
    `$${d.originalPrice.toFixed(2)}`,
    `$${d.salePrice.toFixed(2)}`,
    `${d.discountPct.toFixed(1)}%`,
    d.productUrl,
    d.scannedAt,
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

function escapeCSV(value: string): string {
  // Prevent CSV formula injection (cells starting with =, +, -, @, tab, CR)
  let safe = value;
  if (/^[=+\-@\t\r]/.test(safe)) {
    safe = `'${safe}`;
  }
  if (safe.includes(",") || safe.includes('"') || safe.includes("\n")) {
    return `"${safe.replace(/"/g, '""')}"`;
  }
  return safe;
}
