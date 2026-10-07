import { NextResponse } from "next/server";
import {
  MOCK_ADMISSION_APPLICATIONS,
  generateApplicationNumber,
} from "@/lib/admissions/admissions-engine";
import { AdmissionApplication } from "@/types";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_ADMISSION_APPLICATIONS,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newApplication: AdmissionApplication = {
      id: `app-${Date.now()}`,
      college_id: body.college_id || "c0000000-0000-0000-0000-000000000001",
      application_number: generateApplicationNumber(),
      candidate_name: body.candidate_name || "Applicant Scholar",
      email: body.email || "applicant@example.com",
      phone: body.phone || "+91 98000 00000",
      program_code: body.program_code || "BTECH-CSE",
      program_name: body.program_name || "B.Tech in Computer Science & Engineering (AI & Systems)",
      quota_category: body.quota_category || "All India Open (General)",
      entrance_exam: body.entrance_exam || "National CET 2026",
      entrance_score_rank: body.entrance_score_rank || "Score 96.5",
      qualifying_percentage: Number(body.qualifying_percentage) || 90.0,
      statement_of_purpose: body.statement_of_purpose || "Passionate about research and innovation.",
      status: "submitted",
      allotment_token: null,
      provisional_letter_id: null,
      application_fee_paid: true,
      applied_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Admission application registered successfully. Application tracking token generated.",
      data: newApplication,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to submit admission application" },
      { status: 400 }
    );
  }
}
