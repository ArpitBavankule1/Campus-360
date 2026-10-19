import { NextResponse } from "next/server";
import { getIicAriiaMetrics, getIicPerformanceRating } from "@/lib/iic/iic-engine";

export async function GET() {
  try {
    const ariia = getIicAriiaMetrics();
    const performance = getIicPerformanceRating();
    return NextResponse.json({
      success: true,
      data: {
        ariia,
        performance,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch ARIIA & performance ratings" },
      { status: 500 }
    );
  }
}
