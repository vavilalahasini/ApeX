import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const vercelCronHeader = request.headers.get("x-vercel-cron");
  const cronSecret = process.env.CRON_SECRET;

  // Verify the request is authorized
  if (cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}` && vercelCronHeader !== "true") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else {
    // If no secret configured, only allow Vercel Cron header in production
    if (vercelCronHeader !== "true" && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized. CRON_SECRET is not configured." }, { status: 401 });
    }
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  try {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const { error } = await supabaseAdmin
      .from("rate_limits")
      .delete()
      .lt("window_start", twoHoursAgo);

    if (error) {
      console.error("Rate limit cleanup failed:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Old rate limits cleaned up." });
  } catch (error: any) {
    console.error("Cleanup error:", error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
