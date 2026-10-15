import { NextResponse } from "next/server";
import { getWorldRankingSdgs } from "@/lib/world-rankings/world-rankings-engine";

export async function GET() {
  try {
    const sdgs = getWorldRankingSdgs();
    return NextResponse.json({
      success: true,
      data: sdgs,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch UN SDG Impact rankings" },
      { status: 500 }
    );
  }
}
