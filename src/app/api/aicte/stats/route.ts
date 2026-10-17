import { NextResponse } from "next/server";
import { aicteComplianceStore } from "@/lib/aicte/aicte-engine";

export async function GET() {
  try {
    const stats = aicteComplianceStore.getSummaryStats();
    return NextResponse.json({ success: true, data: stats });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch AICTE compliance summary statistics" },
      { status: 500 }
    );
  }
}
