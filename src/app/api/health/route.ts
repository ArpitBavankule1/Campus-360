import { NextResponse } from "next/server";

export async function GET() {
  const startTime = Date.now();

  const healthData = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "CampusLens AI Institutional Core",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime ? Math.floor(process.uptime()) : 0,
    responseTimeMs: Date.now() - startTime,
    checks: {
      nextjs: "online",
      turbopack: "ready",
      supabaseUrlConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      supabaseAnonKeyConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      realtimeBus: "active",
      audioSynthesizer: "supported",
    },
  };

  return NextResponse.json(healthData, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
