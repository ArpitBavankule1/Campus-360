import { NextRequest, NextResponse } from "next/server";
import { academicCreditsStore } from "@/lib/academic-credits/academic-credits-engine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const apaarId = searchParams.get("apaarId") || undefined;
    const data = academicCreditsStore.getCreditLedgers(apaarId);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch academic credit ledgers" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newCredit = academicCreditsStore.depositCredit(body);
    return NextResponse.json({ success: true, data: newCredit }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to deposit academic credit" },
      { status: 500 }
    );
  }
}
