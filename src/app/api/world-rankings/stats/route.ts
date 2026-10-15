import { NextResponse } from "next/server";
import { getWorldRankingOverviewStats } from "@/lib/world-rankings/world-rankings-engine";

export async function GET() {
  try {
    const stats = getWorldRankingOverviewStats();
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch world rankings overview statistics" },
      { status: 500 }
    );
  }
}
