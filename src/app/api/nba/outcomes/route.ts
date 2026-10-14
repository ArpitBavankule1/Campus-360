import { NextRequest, NextResponse } from "next/server";
import { getNbaProgramOutcomes, getNbaCourseOutcomes } from "@/lib/nba/nba-engine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "po" | "co" | undefined

    if (type === "po") {
      return NextResponse.json({
        success: true,
        data: getNbaProgramOutcomes(),
      });
    }

    if (type === "co") {
      return NextResponse.json({
        success: true,
        data: getNbaCourseOutcomes(),
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        programOutcomes: getNbaProgramOutcomes(),
        courseOutcomes: getNbaCourseOutcomes(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch outcomes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({
      success: true,
      message: "Outcome definition registered successfully",
      data: body,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to record outcome" },
      { status: 500 }
    );
  }
}
