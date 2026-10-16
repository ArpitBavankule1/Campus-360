import { NextRequest, NextResponse } from "next/server";
import { academicCreditsStore } from "@/lib/academic-credits/academic-credits-engine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const data = academicCreditsStore.getApaarRegistries(search);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch APAAR registries" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newRecord = academicCreditsStore.registerApaar(body);
    return NextResponse.json({ success: true, data: newRecord }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to register APAAR record" },
      { status: 500 }
    );
  }
}
