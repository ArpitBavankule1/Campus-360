import { NextResponse } from "next/server";
import { academicCreditsStore } from "@/lib/academic-credits/academic-credits-engine";

export async function GET() {
  try {
    const stats = academicCreditsStore.getSummaryStats();
    return NextResponse.json({ success: true, data: stats });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch Academic Bank of Credits summary stats" },
      { status: 500 }
    );
  }
}
