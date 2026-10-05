import { NextResponse } from "next/server";
import { MOCK_PRINT_STATIONS } from "@/lib/printing/printing-engine";
import { PrintStation } from "@/types";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_PRINT_STATIONS,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updatedStation: PrintStation = {
      id: body.id || `stn-${Date.now()}`,
      college_id: body.college_id || "c0000000-0000-0000-0000-000000000001",
      kiosk_name: body.kiosk_name || "New Print Kiosk",
      campus_building: body.campus_building || "Academic Block",
      floor_location: body.floor_location || "Ground Floor",
      status: body.status || "Online & Ready",
      paper_level_pct: Number(body.paper_level_pct || 90),
      toner_level_pct: Number(body.toner_level_pct || 90),
      supported_sizes: body.supported_sizes || ["A4", "A3"],
      is_color_capable: body.is_color_capable ?? true,
      is_duplex_capable: body.is_duplex_capable ?? true,
      queue_jobs_count: Number(body.queue_jobs_count || 0),
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Print station status updated successfully",
      data: updatedStation,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update print station" },
      { status: 400 }
    );
  }
}
