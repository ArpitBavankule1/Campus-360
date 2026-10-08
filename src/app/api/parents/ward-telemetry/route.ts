import { NextResponse } from "next/server";
import { getWardTelemetry, getGuardianProfile } from "@/lib/parents/parents-engine";

export async function GET() {
  try {
    const ward = getWardTelemetry();
    const guardian = getGuardianProfile();

    return NextResponse.json({
      success: true,
      data: {
        guardian,
        ward,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve ward telemetry" },
      { status: 500 }
    );
  }
}
