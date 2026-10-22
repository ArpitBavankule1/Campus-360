import { NextRequest, NextResponse } from "next/server";
import {
  getSamarthCasApplications,
  createSamarthCasApplication,
  updateSamarthCasStatus,
} from "@/lib/samarth/samarth-engine";

export async function GET() {
  try {
    const applications = getSamarthCasApplications();
    return NextResponse.json({
      success: true,
      data: applications,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch SAMARTH CAS applications" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.faculty_name || !body.department || !body.target_stage) {
      return NextResponse.json(
        { success: false, error: "Missing required CAS application fields" },
        { status: 400 }
      );
    }
    const newApp = createSamarthCasApplication({
      faculty_name: body.faculty_name,
      faculty_email: body.faculty_email || `${body.faculty_name.toLowerCase().replace(/\s+/g, ".")}@campuslens.edu`,
      department: body.department,
      current_designation: body.current_designation || "Assistant Professor",
      current_stage: body.current_stage || "Stage 1 (Assistant Prof)",
      target_stage: body.target_stage,
      api_score_claimed: Number(body.api_score_claimed) || 80,
      api_score_verified: Number(body.api_score_verified) || Number(body.api_score_claimed) || 80,
      publications_count: Number(body.publications_count) || 5,
      research_projects_count: Number(body.research_projects_count) || 1,
      status: body.status || "SUBMITTED",
      scrutiny_notes: body.scrutiny_notes || "Self-appraisal submitted with verified UGC CARE publications.",
      submission_date: new Date().toISOString().split("T")[0],
    });
    return NextResponse.json({
      success: true,
      message: "SAMARTH CAS application submitted successfully",
      data: newApp,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to submit SAMARTH CAS application" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.cas_token || !body.status) {
      return NextResponse.json(
        { success: false, error: "Missing cas_token or status" },
        { status: 400 }
      );
    }
    const updated = updateSamarthCasStatus(body.cas_token, body.status, body.scrutiny_notes);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "CAS application not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "SAMARTH CAS application status updated",
      data: updated,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update SAMARTH CAS application status" },
      { status: 500 }
    );
  }
}
