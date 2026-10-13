import { NextResponse } from "next/server";
import { getNirfStats } from "@/lib/nirf/nirf-engine";

export async function GET() {
  try {
    const stats = getNirfStats();
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch NIRF overview stats" },
      { status: 500 }
    );
  }
}
