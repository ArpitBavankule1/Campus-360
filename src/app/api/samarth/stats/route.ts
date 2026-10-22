import { NextResponse } from "next/server";
import { getSamarthSummaryStats } from "@/lib/samarth/samarth-engine";

export async function GET() {
  try {
    const stats = getSamarthSummaryStats();
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch SAMARTH summary metrics & analytics" },
      { status: 500 }
    );
  }
}
