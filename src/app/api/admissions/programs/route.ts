import { NextResponse } from "next/server";
import { MOCK_ACADEMIC_PROGRAMS } from "@/lib/admissions/admissions-engine";
import { AcademicProgram } from "@/types";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_ACADEMIC_PROGRAMS,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newProgram: AcademicProgram = {
      id: `prog-${Date.now()}`,
      college_id: body.college_id || "c0000000-0000-0000-0000-000000000001",
      program_code: body.program_code || `PROG-${Math.floor(100 + Math.random() * 900)}`,
      program_name: body.program_name || "New Academic Degree Program",
      department: body.department || "Engineering",
      degree_level: body.degree_level || "Undergraduate (B.Tech)",
      duration_years: Number(body.duration_years) || 4,
      total_seats: Number(body.total_seats) || 60,
      available_seats: Number(body.available_seats) || 60,
      annual_tuition_inr: Number(body.annual_tuition_inr) || 180000,
      eligibility_cutoff: body.eligibility_cutoff || "Entrance Percentile >= 90.0",
      accreditation: body.accreditation || "NBA Tier-1 & NAAC A++",
      application_deadline: body.application_deadline || "2026-12-31",
      is_admissions_open: body.is_admissions_open ?? true,
      brochure_url: body.brochure_url || null,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Academic degree program registered successfully in admissions catalogue.",
      data: newProgram,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create academic program" },
      { status: 400 }
    );
  }
}
