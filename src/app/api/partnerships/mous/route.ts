import { NextRequest, NextResponse } from "next/server";
import { getIndustryMoUs } from "@/lib/partnerships/partnerships-engine";
import { MoUTier } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sector = searchParams.get("sector") || "all";
    const tier = (searchParams.get("tier") as MoUTier) || undefined;

    const mous = getIndustryMoUs(sector, tier);
    return NextResponse.json({
      success: true,
      data: mous,
      count: mous.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch industry MoUs" },
      { status: 500 }
    );
  }
}
