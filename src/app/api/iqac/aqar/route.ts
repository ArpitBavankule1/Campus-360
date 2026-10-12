import { NextRequest, NextResponse } from "next/server";
import { getIqacOverviewStats, submitAqarDraft } from "@/lib/iqac/iqac-engine";

export async function GET() {
  try {
    const stats = getIqacOverviewStats();
    return NextResponse.json({
      success: true,
      data: stats.aqarReports,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch AQAR reports" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { academic_year, iqac_director, criteria_scores } = body;

    if (!academic_year) {
      return NextResponse.json(
        { success: false, error: "Missing required field: academic_year" },
        { status: 400 }
      );
    }

    const report = submitAqarDraft({
      academic_year,
      iqac_director: iqac_director || "Dr. P. K. Nambiar (IQAC Director)",
      criteria_scores,
    });

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to submit AQAR draft" },
      { status: 500 }
    );
  }
}
