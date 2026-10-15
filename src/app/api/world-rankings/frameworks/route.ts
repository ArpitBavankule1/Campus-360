import { NextResponse } from "next/server";
import { getWorldRankingFrameworks } from "@/lib/world-rankings/world-rankings-engine";

export async function GET() {
  try {
    const frameworks = getWorldRankingFrameworks();
    return NextResponse.json({
      success: true,
      data: frameworks,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch world ranking frameworks" },
      { status: 500 }
    );
  }
}
