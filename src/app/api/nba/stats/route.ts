import { NextResponse } from "next/server";
import { getNbaStats } from "@/lib/nba/nba-engine";

export async function GET() {
  try {
    const stats = getNbaStats();
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch NBA overview statistics" },
      { status: 500 }
    );
  }
}
