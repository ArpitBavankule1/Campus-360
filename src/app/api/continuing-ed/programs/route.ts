import { NextRequest, NextResponse } from "next/server";
import { getExecutivePrograms } from "@/lib/continuing-ed/continuing-ed-engine";
import { ProgramType } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = (searchParams.get("type") as ProgramType) || undefined;
    const department = searchParams.get("department") || undefined;

    const programs = getExecutivePrograms({ type, department });
    return NextResponse.json({
      success: true,
      data: programs,
      count: programs.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch executive continuing education programs" },
      { status: 500 }
    );
  }
}
