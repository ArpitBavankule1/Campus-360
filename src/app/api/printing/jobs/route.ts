import { NextResponse } from "next/server";
import {
  MOCK_PRINT_JOBS,
  generatePrintJobCode,
  generateKioskReleasePin,
} from "@/lib/printing/printing-engine";
import { PrintJob } from "@/types";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_PRINT_JOBS,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const pageCount = Number(body.page_count || 10);
    const isColor = body.color_mode === "High-Res Color";
    const costPerPage = isColor ? 2.0 : 0.0; // Free for B&W within quota, 2 INR for color
    const totalCost = pageCount * costPerPage;

    const newJob: PrintJob = {
      id: `job-${Date.now()}`,
      college_id: body.college_id || "c0000000-0000-0000-0000-000000000001",
      job_code: generatePrintJobCode(),
      scholar_id: body.scholar_id || "SCH-CS-2023-019",
      scholar_name: body.scholar_name || "Aarav Sharma",
      document_name: body.document_name || "Document.pdf",
      page_count: pageCount,
      color_mode: body.color_mode || "Monochrome B&W",
      duplex_mode: body.duplex_mode || "Double-Sided Duplex",
      total_cost_inr: totalCost,
      pickup_kiosk_name: body.pickup_kiosk_name || "Central Library Smart Kiosk A (Canon ImageRunner 5560)",
      status: "Ready for Kiosk Pickup",
      release_pin: generateKioskReleasePin(),
      release_token_hash: `TOKEN_0x${Math.random().toString(16).substring(2, 10).toUpperCase()}_PRINT_SECURE`,
      submitted_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Print job spooled to cloud queue. Pickup PIN and release QR generated.",
      data: newJob,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to spool print job" },
      { status: 400 }
    );
  }
}
