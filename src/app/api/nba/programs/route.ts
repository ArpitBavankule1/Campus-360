import { NextRequest, NextResponse } from "next/server";
import { getNbaPrograms } from "@/lib/nba/nba-engine";

export async function GET() {
  try {
    const programs = getNbaPrograms();
    return NextResponse.json({
      success: true,
      data: programs,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch NBA accredited programs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { program_code, program_name, department, tier, accreditation_status } = body;

    if (!program_code || !program_name || !department) {
      return NextResponse.json(
        { success: false, error: "Missing required program fields" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Program ${program_code} registered under ${tier || "Tier_1_Washington_Accord"}`,
      data: body,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create NBA program" },
      { status: 500 }
    );
  }
}
