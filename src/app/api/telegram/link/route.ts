import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isProSubscriber } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { chatId, zip, email } = body;

    if (!chatId || !zip) {
      return NextResponse.json(
        { error: "chatId and zip are required." },
        { status: 400 }
      );
    }

    const isPro = await isProSubscriber(email || "");
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
        chat_id: chatId,
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

    // Send confirmation message
    await sendTelegramMessage(
      chatId,
      `✅ Deal alerts activated for ZIP ${zip} (50mi radius). You'll get notified when new clearance deals appear!`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Telegram link error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
