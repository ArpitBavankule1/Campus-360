import { NextResponse } from "next/server";
import { getPmUshaSummaryStats } from "@/lib/pm-usha/pm-usha-engine";

export async function GET() {
  try {
    const stats = getPmUshaSummaryStats();
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to generate PM-USHA summary statistics" },
      { status: 500 }
    );
  }
}
