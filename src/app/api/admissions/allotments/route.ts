import { NextResponse } from "next/server";
import {
  MOCK_SEAT_ALLOTMENTS,
  generateAllotmentNumber,
  generateProvisionalOfferLetterId,
} from "@/lib/admissions/admissions-engine";
import { SeatAllotmentDocket } from "@/types";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_SEAT_ALLOTMENTS,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const allotmentNum = generateAllotmentNumber();
    const offerLetterId = generateProvisionalOfferLetterId();

    const newDocket: SeatAllotmentDocket = {
      id: `allot-${Date.now()}`,
      college_id: body.college_id || "c0000000-0000-0000-0000-000000000001",
      allotment_number: allotmentNum,
      candidate_name: body.candidate_name || "Applicant Scholar",
      application_number: body.application_number || "CL-ADM-APP-2026-9999",
      program_code: body.program_code || "BTECH-CSE",
      program_name: body.program_name || "B.Tech in Computer Science & Engineering (AI & Systems)",
      counseling_round: body.counseling_round || "Round 1 (Merit Allocation)",
      allotted_category: body.allotted_category || "All India Open (General)",
      merit_rank: Number(body.merit_rank) || 500,
      acceptance_deadline: body.acceptance_deadline || "2026-11-10",
      seat_lock_deposit_inr: Number(body.seat_lock_deposit_inr) || 25000,
      is_seat_accepted: body.is_seat_accepted ?? true,
      provisional_letter_url: `/admissions/letters/${offerLetterId}.pdf`,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Merit seat allotment docket created. Provisional admission offer letter released.",
      data: newDocket,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to generate seat allotment docket" },
      { status: 400 }
    );
  }
}
