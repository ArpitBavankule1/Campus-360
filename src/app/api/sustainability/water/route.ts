import { NextRequest, NextResponse } from "next/server";
import { MOCK_WATER_METRICS } from "@/lib/sustainability/sustainability-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { WaterMetric } from "@/types";

const activeWater: WaterMetric[] = [...MOCK_WATER_METRICS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const reservoir = searchParams.get("reservoir");

    if (reservoir && (containsSQLInjection(reservoir) || containsXSS(reservoir))) {
      return NextResponse.json(
        { success: false, error: "Invalid reservoir query parameter." },
        { status: 400 }
      );
    }

    let results = [...activeWater];

    if (reservoir && reservoir !== "all") {
      const sanitizedRes = sanitizeInput(reservoir).toLowerCase();
      results = results.filter((w) => w.reservoir_name.toLowerCase().includes(sanitizedRes));
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error("Water metrics GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch water metrics." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      reservoir_name,
      capacity_kiloliters,
      current_reserve_kiloliters,
      greywater_recycled_liters_today,
      water_quality_index,
      tds_ppm,
      ph_level,
    } = body;

    if (!reservoir_name || current_reserve_kiloliters === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required water reservoir metric parameters." },
        { status: 400 }
      );
    }

    if (containsSQLInjection(reservoir_name) || containsXSS(reservoir_name)) {
      return NextResponse.json(
        { success: false, error: "Security validation error in reservoir name." },
        { status: 400 }
      );
    }

    const newMetric: WaterMetric = {
      id: `wat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      reservoir_name: sanitizeInput(reservoir_name),
      capacity_kiloliters: Number(capacity_kiloliters) || 300.0,
      current_reserve_kiloliters: Number(current_reserve_kiloliters),
      greywater_recycled_liters_today: Number(greywater_recycled_liters_today) || 15000.0,
      water_quality_index: Number(water_quality_index) || 94.0,
      tds_ppm: Number(tds_ppm) || 120,
      ph_level: Number(ph_level) || 7.2,
      updated_at: new Date().toISOString(),
    };

    activeWater.unshift(newMetric);

    return NextResponse.json(
      {
        success: true,
        message: "Water reservoir telemetry updated successfully.",
        data: newMetric,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Water metrics POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record water metrics." },
      { status: 500 }
    );
  }
}
