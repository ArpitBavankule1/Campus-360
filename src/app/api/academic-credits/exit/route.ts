import { NextRequest, NextResponse } from "next/server";
import { academicCreditsStore } from "@/lib/academic-credits/academic-credits-engine";

export async function GET() {
  try {
    const data = academicCreditsStore.getNepExitQualifications();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch NEP 2020 exit qualifications" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newExit = academicCreditsStore.applyNepExit(body);
    return NextResponse.json({ success: true, data: newExit }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to file NEP 2020 exit qualification application" },
      { status: 500 }
    );
  }
}
