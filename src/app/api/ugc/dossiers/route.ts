import { NextRequest, NextResponse } from "next/server";
import { ugcAutonomousStore } from "@/lib/ugc/ugc-engine";

export async function GET() {
  try {
    const data = ugcAutonomousStore.getDossiers();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch UGC compliance dossiers" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = ugcAutonomousStore.submitComplianceDossier(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to submit compliance dossier" },
      { status: 500 }
    );
  }
}
