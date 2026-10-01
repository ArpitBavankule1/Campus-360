import { NextRequest, NextResponse } from "next/server";
import { MOCK_SOLAR_TELEMETRY } from "@/lib/sustainability/sustainability-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { SolarTelemetry } from "@/types";

const activeSolar: SolarTelemetry[] = [...MOCK_SOLAR_TELEMETRY];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const zone = searchParams.get("zone");

    if (zone && (containsSQLInjection(zone) || containsXSS(zone))) {
      return NextResponse.json(
        { success: false, error: "Invalid zone query parameter." },
        { status: 400 }
      );
    }

    let results = [...activeSolar];

    if (zone && zone !== "all") {
      const sanitizedZone = sanitizeInput(zone).toLowerCase();
      results = results.filter((s) => s.array_zone.toLowerCase().includes(sanitizedZone));
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error("Solar telemetry GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch solar telemetry." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      array_zone,
      peak_capacity_kwp,
      current_generation_kw,
      daily_total_kwh,
      battery_storage_percent,
      grid_export_kw,
    } = body;

    if (!array_zone || current_generation_kw === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required solar telemetry data." },
        { status: 400 }
      );
    }

    if (containsSQLInjection(array_zone) || containsXSS(array_zone)) {
      return NextResponse.json(
        { success: false, error: "Security validation error in solar array zone." },
        { status: 400 }
      );
    }

    const currentGen = Number(current_generation_kw) || 0;
    const carbonOffset = Number((currentGen * 4.68).toFixed(1));

    const newReading: SolarTelemetry = {
      id: `sol-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      array_zone,
      peak_capacity_kwp: Number(peak_capacity_kwp) || 200.0,
      current_generation_kw: currentGen,
      daily_total_kwh: Number(daily_total_kwh) || currentGen * 5.5,
      battery_storage_percent: Number(battery_storage_percent) || 85,
      grid_export_kw: Number(grid_export_kw) || 15.0,
      carbon_offset_kg: carbonOffset,
      timestamp: new Date().toISOString(),
    };

    activeSolar.unshift(newReading);

    return NextResponse.json(
      {
        success: true,
        message: "Solar PV microgrid telemetry reading logged successfully.",
        data: newReading,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Solar telemetry POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record solar telemetry reading." },
      { status: 500 }
    );
  }
}
