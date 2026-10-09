import { NextResponse } from "next/server";
import { getFellowshipOverviewStats } from "@/lib/fellowships/fellowships-engine";

export async function GET() {
  try {
    const stats = getFellowshipOverviewStats();
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch fellowship statistics" },
      { status: 500 }
    );
  }
}
