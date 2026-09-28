import { NextRequest, NextResponse } from "next/server";
import { MOCK_INSTITUTIONAL_FEE_STATS } from "@/lib/fees/fee-engine";

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: MOCK_INSTITUTIONAL_FEE_STATS,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
