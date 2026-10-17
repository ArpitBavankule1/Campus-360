import { NextRequest, NextResponse } from "next/server";
import { aicteComplianceStore } from "@/lib/aicte/aicte-engine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const level = searchParams.get("level") || undefined;
    const data = aicteComplianceStore.getPrograms(search, level);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch AICTE approved programs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newProgram = aicteComplianceStore.addProgram(body);
    return NextResponse.json({ success: true, data: newProgram }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to add AICTE approved program" },
      { status: 500 }
    );
  }
}
