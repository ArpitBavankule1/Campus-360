import { NextResponse } from "next/server";
import { getAisheSummaryStats } from "@/lib/aishe/aishe-engine";

export async function GET() {
  try {
    const stats = getAisheSummaryStats();
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch AISHE summary statistics" },
      { status: 500 }
    );
  }
}
