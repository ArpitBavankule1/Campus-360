import { NextResponse } from "next/server";
import { getWorldRankingBenchmarks } from "@/lib/world-rankings/world-rankings-engine";

export async function GET() {
  try {
    const benchmarks = getWorldRankingBenchmarks();
    return NextResponse.json({
      success: true,
      data: benchmarks,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch global peer benchmarks" },
      { status: 500 }
    );
  }
}
