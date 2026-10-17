import { NextResponse } from "next/server";
import { aicteComplianceStore } from "@/lib/aicte/aicte-engine";

export async function GET() {
  try {
    const data = aicteComplianceStore.getCadreMetrics();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch AICTE cadre and FSR metrics" },
      { status: 500 }
    );
  }
}
