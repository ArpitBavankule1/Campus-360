import { NextRequest, NextResponse } from "next/server";
import { getIqacOverviewStats, updateCriterionMetric } from "@/lib/iqac/iqac-engine";
import { NaacCriterionCode } from "@/types";

export async function GET() {
  try {
    const stats = getIqacOverviewStats();
    return NextResponse.json({
      success: true,
      data: stats.criteria,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch NAAC criteria" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { criterion_code, current_score, ssr_readiness_percentage } = body;

    if (!criterion_code || current_score === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing criterion_code or current_score" },
        { status: 400 }
      );
    }

    const updated = updateCriterionMetric(
      criterion_code as NaacCriterionCode,
      Number(current_score),
      Number(ssr_readiness_percentage || 95)
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Criterion not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update criterion metric" },
      { status: 500 }
    );
  }
}
