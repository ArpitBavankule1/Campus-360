import { NextResponse } from "next/server";
import { getPartnershipsOverviewStats } from "@/lib/partnerships/partnerships-engine";

export async function GET() {
  try {
    const stats = getPartnershipsOverviewStats();
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch partnerships stats" },
      { status: 500 }
    );
  }
}
