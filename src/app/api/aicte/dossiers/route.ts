import { NextRequest, NextResponse } from "next/server";
import { aicteComplianceStore } from "@/lib/aicte/aicte-engine";

export async function GET() {
  try {
    const data = aicteComplianceStore.getDossiers();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch AICTE EoA dossiers" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newDossier = aicteComplianceStore.createEoaDossier(body);
    return NextResponse.json({ success: true, data: newDossier }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create AICTE EoA dossier" },
      { status: 500 }
    );
  }
}
