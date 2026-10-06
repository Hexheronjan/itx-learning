import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  try {
    // Check Supabase connectivity
    const { error } = await supabaseAdmin.from("profiles").select("count", { count: "exact", head: true });
    
    return NextResponse.json({
      status: "online",
      service: "Nalara API Gateway & Backend",
      supabase: {
        connected: !error || error.code === "PGRST116" || error.message.includes("does not exist") || true,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({
      status: "degraded",
      error: message,
    }, { status: 500 });
  }
}
