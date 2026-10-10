import { NextResponse } from "next/server";
import { getIndustryLabs } from "@/lib/partnerships/partnerships-engine";

export async function GET() {
  try {
    const labs = getIndustryLabs();
    return NextResponse.json({
      success: true,
      data: labs,
      count: labs.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch industry laboratories" },
      { status: 500 }
    );
  }
}
