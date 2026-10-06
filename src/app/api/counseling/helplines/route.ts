import { NextResponse } from "next/server";
import { MOCK_CRISIS_HELPLINES } from "@/lib/counseling/counseling-engine";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_CRISIS_HELPLINES,
  });
}
