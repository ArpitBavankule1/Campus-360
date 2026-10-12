import { NextRequest, NextResponse } from "next/server";
import { getIqacOverviewStats, fileBestPractice } from "@/lib/iqac/iqac-engine";

export async function GET() {
  try {
    const stats = getIqacOverviewStats();
    return NextResponse.json({
      success: true,
      data: stats.bestPractices,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch best practices" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      practice_title,
      thematic_area,
      contextual_background,
      objectives,
      practice_implementation,
      evidence_of_success,
      sdg_goals,
      beneficiaries_impacted,
    } = body;

    if (!practice_title || !thematic_area || !objectives) {
      return NextResponse.json(
        { success: false, error: "Missing required best practice fields" },
        { status: 400 }
      );
    }

    const practice = fileBestPractice({
      practice_title,
      thematic_area,
      contextual_background: contextual_background || "Institutional initiative",
      objectives,
      practice_implementation: practice_implementation || "Phased implementation across academic departments",
      evidence_of_success: evidence_of_success || "Verified through internal metrics",
      sdg_goals: Array.isArray(sdg_goals) ? sdg_goals : ["SDG 4: Quality Education"],
      beneficiaries_impacted: Number(beneficiaries_impacted || 5000),
    });

    return NextResponse.json({
      success: true,
      data: practice,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to file institutional best practice" },
      { status: 500 }
    );
  }
}
