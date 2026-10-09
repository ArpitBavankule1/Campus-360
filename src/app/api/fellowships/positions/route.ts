import { NextRequest, NextResponse } from "next/server";
import { getFellowshipPositions } from "@/lib/fellowships/fellowships-engine";
import { FellowshipType } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = (searchParams.get("type") as FellowshipType | "all") || "all";
    const department = searchParams.get("department") || "all";
    const query = searchParams.get("q") || "";

    const positions = getFellowshipPositions(type, department, query);
    return NextResponse.json({
      success: true,
      data: positions,
      count: positions.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch fellowship positions" },
      { status: 500 }
    );
  }
}
