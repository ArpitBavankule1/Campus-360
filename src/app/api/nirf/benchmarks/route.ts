import { NextResponse } from "next/server";
import { getNirfBenchmarks } from "@/lib/nirf/nirf-engine";

export async function GET() {
  try {
    const benchmarks = getNirfBenchmarks();
    return NextResponse.json({
      success: true,
      data: benchmarks,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch NIRF benchmarks" },
      { status: 500 }
    );
  }
}
