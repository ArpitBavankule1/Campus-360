import { NextRequest, NextResponse } from "next/server";
import { getWorldRankingMetrics } from "@/lib/world-rankings/world-rankings-engine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const frameworkCode = searchParams.get("frameworkCode") || undefined;
    const metrics = getWorldRankingMetrics(frameworkCode);

    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch world ranking metrics" },
      { status: 500 }
    );
  }
}
