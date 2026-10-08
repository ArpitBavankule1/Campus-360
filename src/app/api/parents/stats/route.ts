import { NextResponse } from "next/server";
import { getParentPortalOverviewStats } from "@/lib/parents/parents-engine";

export async function GET() {
  try {
    const stats = getParentPortalOverviewStats();
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch Parent Portal overview statistics" },
      { status: 500 }
    );
  }
}
