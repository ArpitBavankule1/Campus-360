import { NextResponse } from "next/server";
import { getIicSummaryStats } from "@/lib/iic/iic-engine";

export async function GET() {
  try {
    const stats = getIicSummaryStats();
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch IIC summary statistics" },
      { status: 500 }
    );
  }
}
