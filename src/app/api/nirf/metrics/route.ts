import { NextRequest, NextResponse } from "next/server";
import { getNirfDataMetrics, addNirfDataMetric } from "@/lib/nirf/nirf-engine";
import { NirfParameterCode } from "@/types";

export async function GET() {
  try {
    const metrics = getNirfDataMetrics();
    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch NIRF data metrics" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      parameter_code,
      metric_code,
      metric_title,
      department,
      reported_value,
      benchmark_value,
      weightage,
      score_achieved,
      verified_by,
      evidence_url,
    } = body;

    if (!parameter_code || !metric_code || !metric_title || !department) {
      return NextResponse.json(
        { success: false, error: "Missing required fields for NIRF data metric" },
        { status: 400 }
      );
    }

    const newMetric = addNirfDataMetric({
      parameter_code: parameter_code as NirfParameterCode,
      metric_code,
      metric_title,
      department,
      reported_value,
      benchmark_value,
      weightage: Number(weightage || 10),
      score_achieved: Number(score_achieved || 8),
      verified_by,
      evidence_url,
    });

    return NextResponse.json({
      success: true,
      data: newMetric,
      message: `Recorded metric ${newMetric.metric_code}`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to add NIRF data metric" },
      { status: 500 }
    );
  }
}
