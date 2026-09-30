import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_MEDICAL_LEAVES,
  generateLeaveCode,
  calculateAttendanceWaiver,
} from "@/lib/health/health-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { MedicalLeaveRequest } from "@/types";

const activeLeaves: MedicalLeaveRequest[] = [...MOCK_MEDICAL_LEAVES];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("student_id");

    let results = [...activeLeaves];
    if (studentId) {
      const sanitizedStudent = sanitizeInput(studentId);
      results = results.filter((l) => l.student_id === sanitizedStudent);
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error("Medical leaves query error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve medical leave requests." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { startDate, endDate, reason, studentId } = body;

    if (!startDate || !endDate || !reason) {
      return NextResponse.json(
        { success: false, error: "Start date, end date, and reason are required." },
        { status: 400 }
      );
    }

    if (containsSQLInjection(reason) || containsXSS(reason)) {
      return NextResponse.json(
        { success: false, error: "Malicious characters detected in medical leave reason." },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      return NextResponse.json(
        { success: false, error: "End date must be on or after start date." },
        { status: 400 }
      );
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const waiver = calculateAttendanceWaiver(totalDays);

    const newLeave: MedicalLeaveRequest = {
      id: `ml-${Date.now()}`,
      college_id: "col-apex-001",
      student_id: studentId || "00000000-0000-0000-0000-000000000001",
      leave_code: generateLeaveCode(),
      start_date: sanitizeInput(startDate),
      end_date: sanitizeInput(endDate),
      total_days: totalDays,
      reason: sanitizeInput(reason),
      doctor_certificate_url: "/docs/certificates/sample-upload.pdf",
      attendance_waiver_granted: true,
      verified_by: "Campus Medical Board",
      status: "approved",
      created_at: new Date().toISOString(),
    };

    activeLeaves.unshift(newLeave);

    return NextResponse.json({
      success: true,
      data: newLeave,
      waiver,
      message: `Medical leave approved for ${totalDays} days with attendance waiver granted.`,
    });
  } catch (error) {
    console.error("Medical leave submission error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process medical leave request." },
      { status: 500 }
    );
  }
}
