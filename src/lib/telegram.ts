import type { Deal } from "./scrapers/types";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export async function sendTelegramMessage(
  chatId: string,
  text: string
): Promise<boolean> {
  try {
    const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function formatDealAlert(deals: Deal[], zip: string): string {
  const topDeals = deals.slice(0, 10);
  const lines = [
    `🏷️ <b>New Clearance Deals near ${zip}</b>`,
    `Found ${deals.length} deals — top ${topDeals.length}:`,
    "",
  ];

  for (const d of topDeals) {
    const retailer = d.retailer === "home_depot" ? "HD" : "Lowes";
    lines.push(
      `• <b>${d.productName}</b>`,
      `  ${retailer} — ${d.storeName} (${d.distanceMiles}mi)`,
      `  <s>$${d.originalPrice.toFixed(2)}</s> → <b>$${d.salePrice.toFixed(2)}</b> (${d.discountPct.toFixed(0)}% off)`,
      ""
    );
  }

  return lines.join("\n");
}
