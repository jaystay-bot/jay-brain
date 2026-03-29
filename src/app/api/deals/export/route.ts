import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isProSubscriber } from "@/lib/stripe";
import { dealsToCSV } from "@/lib/csv";
import { Deal } from "@/lib/scrapers/types";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const email = body.email || "";

    const isPro = await isProSubscriber(email);
    if (!isPro) {
      return NextResponse.json(
        { error: "CSV export is a Pro feature. Upgrade to access." },
        { status: 403 }
      );
    }

    const deals: Deal[] = body.deals || [];
    if (deals.length === 0) {
      return NextResponse.json(
        { error: "No deals to export." },
        { status: 400 }
      );
    }

    const csv = dealsToCSV(deals);

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="clearance-deals-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("CSV export error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
