import { NextRequest, NextResponse } from "next/server";
import { academicCreditsStore } from "@/lib/academic-credits/academic-credits-engine";

export async function GET() {
  try {
    const data = academicCreditsStore.getNadSyncLogs();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch DigiLocker NAD sync logs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const officer = body.officer || "Chief Registrar & Institutional NAD Coordinator";
    const newLog = academicCreditsStore.triggerNadSync(officer);
    return NextResponse.json({ success: true, data: newLog }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to trigger DigiLocker NAD synchronization" },
      { status: 500 }
    );
  }
}
