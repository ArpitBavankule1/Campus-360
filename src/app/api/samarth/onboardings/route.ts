import { NextRequest, NextResponse } from "next/server";
import {
  getSamarthStudentOnboardings,
  createSamarthStudentOnboarding,
  updateSamarthOnboardingStatus,
} from "@/lib/samarth/samarth-engine";

export async function GET() {
  try {
    const students = getSamarthStudentOnboardings();
    return NextResponse.json({
      success: true,
      data: students,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch SAMARTH student onboardings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.student_name || !body.enrollment_number || !body.apaar_id || !body.program_name) {
      return NextResponse.json(
        { success: false, error: "Missing required onboarding attributes" },
        { status: 400 }
      );
    }
    const newStudent = createSamarthStudentOnboarding({
      student_name: body.student_name,
      student_email: body.student_email || `${body.student_name.toLowerCase().replace(/\s+/g, ".")}@campuslens.edu`,
      enrollment_number: body.enrollment_number,
      apaar_id: body.apaar_id,
      program_name: body.program_name,
      admission_quota: body.admission_quota || "Merit (State Cap)",
      academic_year: body.academic_year || "2026-2027",
      verification_status: body.verification_status || "VERIFIED",
      fee_clearance_status: body.fee_clearance_status || "CLEARED",
      digilocker_verified: body.digilocker_verified ?? true,
      samarth_sso_linked: body.samarth_sso_linked ?? true,
    });
    return NextResponse.json({
      success: true,
      message: "SAMARTH student onboarding registered successfully",
      data: newStudent,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to register SAMARTH student onboarding" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.onboarding_token || !body.verification_status) {
      return NextResponse.json(
        { success: false, error: "Missing onboarding_token or verification_status" },
        { status: 400 }
      );
    }
    const updated = updateSamarthOnboardingStatus(body.onboarding_token, body.verification_status);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Onboarding record not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "SAMARTH student verification status updated",
      data: updated,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update onboarding status" },
      { status: 500 }
    );
  }
}
