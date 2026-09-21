import { NextResponse } from "next/server";
import { testSupabaseConnection } from "@/lib/supabase/connection-test";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = await testSupabaseConnection();
  return NextResponse.json({
    status: status.connected ? "healthy" : "needs_configuration",
    timestamp: new Date().toISOString(),
    details: status,
  });
}
