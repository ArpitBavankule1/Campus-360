import { NextResponse } from "next/server";
import { getContinuingEducationStats } from "@/lib/continuing-ed/continuing-ed-engine";

export async function GET() {
  try {
    const stats = getContinuingEducationStats();
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch continuing education stats" },
      { status: 500 }
    );
  }
}
