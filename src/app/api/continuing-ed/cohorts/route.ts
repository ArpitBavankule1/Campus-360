import { NextRequest, NextResponse } from "next/server";
import { getFacultyCohorts, registerFacultyCohort } from "@/lib/continuing-ed/continuing-ed-engine";

export async function GET() {
  try {
    const cohorts = getFacultyCohorts();
    return NextResponse.json({
      success: true,
      data: cohorts,
      count: cohorts.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch faculty development cohorts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.cohort_name || !body.coordinating_department || !body.lead_convenor) {
      return NextResponse.json(
        { success: false, error: "Missing required fields for faculty cohort registration" },
        { status: 400 }
      );
    }

    const cohort = registerFacultyCohort({
      cohort_name: body.cohort_name,
      program_id: body.program_id,
      coordinating_department: body.coordinating_department,
      aicte_atal_recognized: body.aicte_atal_recognized ?? true,
      lead_convenor: body.lead_convenor,
      grant_subsidy_inr: body.grant_subsidy_inr ?? 500000,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Faculty development cohort registered successfully",
        data: cohort,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to register faculty cohort" },
      { status: 500 }
    );
  }
}
