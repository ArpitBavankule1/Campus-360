import { NextResponse } from "next/server";
import { getIqacOverviewStats } from "@/lib/iqac/iqac-engine";

export async function GET() {
  try {
    const stats = getIqacOverviewStats();
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch IQAC overview stats" },
      { status: 500 }
    );
  }
}
