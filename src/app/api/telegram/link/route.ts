import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { isProSubscriber } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { sendTelegramMessage } from "@/lib/telegram";
import { isValidZip } from "@/lib/geo";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { chatId, zip } = body;

    if (!chatId || !zip) {
      return NextResponse.json(
        { error: "chatId and zip are required." },
        { status: 400 }
      );
    }

    // Validate chatId is numeric (Telegram chat IDs are integers)
    if (!/^-?\d+$/.test(String(chatId))) {
      return NextResponse.json(
        { error: "Invalid Telegram chat ID." },
        { status: 400 }
      );
    }

    // Validate ZIP
    if (!isValidZip(zip)) {
      return NextResponse.json(
        { error: "Invalid ZIP code." },
        { status: 400 }
      );
    }

    // Use Clerk's authenticated email — never trust client-supplied email
    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress || "";

    const isPro = email ? await isProSubscriber(email) : false;
    if (!isPro) {
      return NextResponse.json(
        { error: "Telegram alerts are a Pro feature." },
        { status: 403 }
      );
    }

    // Save telegram subscription
    const { error } = await supabase.from("telegram_subs").upsert(
      {
        user_id: userId,
        chat_id: String(chatId),
        zip_code: zip,
        radius_miles: 50,
        is_active: true,
        created_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (error) {
      console.error("Telegram sub save error:", error);
      return NextResponse.json(
        { error: "Failed to save subscription." },
        { status: 500 }
      );
    }

    // Send confirmation — report failure to user
    const sent = await sendTelegramMessage(
      String(chatId),
      `Deal alerts activated for ZIP ${zip} (50mi radius). You'll get notified when new clearance deals appear!`
    );

    if (!sent) {
      return NextResponse.json(
        { error: "Subscription saved but could not send confirmation message. Check your chat ID." },
        { status: 207 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Telegram link error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
