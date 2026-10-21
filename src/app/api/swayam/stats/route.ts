import { NextResponse } from "next/server";
import { getSwayamSummaryStats } from "@/lib/swayam/swayam-engine";

export async function GET() {
  try {
    const stats = getSwayamSummaryStats();
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch SWAYAM summary statistics" },
      { status: 500 }
    );
  }
}
