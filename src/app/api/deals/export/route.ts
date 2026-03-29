import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { isProSubscriber } from "@/lib/stripe";
import { dealsToCSV } from "@/lib/csv";
import { Deal } from "@/lib/scrapers/types";

const MAX_DEALS_EXPORT = 1000;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use Clerk's authenticated email — never trust client-supplied email
    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress || "";

    const isPro = email ? await isProSubscriber(email) : false;
    if (!isPro) {
      return NextResponse.json(
        { error: "CSV export is a Pro feature. Upgrade to access." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const deals: Deal[] = body.deals || [];

    if (deals.length === 0) {
      return NextResponse.json(
        { error: "No deals to export." },
        { status: 400 }
      );
    }

    // Cap export size to prevent abuse
    const capped = deals.slice(0, MAX_DEALS_EXPORT);
    const csv = dealsToCSV(capped);

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="clearance-deals-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error: unknown) {
    console.error("CSV export error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
