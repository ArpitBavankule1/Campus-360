import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_STUDENT_FEE_DUES,
  calculateStudentFeeSummary,
} from "@/lib/fees/fee-engine";
import {
  containsSQLInjection,
  containsXSS,
} from "@/lib/security/sanitize";
import { StudentFeeDue } from "@/types";

let currentDues: StudentFeeDue[] = [...MOCK_STUDENT_FEE_DUES];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("student_id") || "usr-demo-01";
    const status = searchParams.get("status");
    const semester = searchParams.get("semester");

    // Injection attack protection
    if (
      (status && (containsSQLInjection(status) || containsXSS(status))) ||
      (semester && (containsSQLInjection(semester) || containsXSS(semester))) ||
      containsSQLInjection(studentId)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid parameter format detected." },
        { status: 400 }
      );
    }

    let results = currentDues.filter((d) => d.student_id === studentId);

    if (status) {
      results = results.filter((d) => d.status === status);
    }

    if (semester) {
      results = results.filter((d) => d.semester.toLowerCase() === semester.toLowerCase());
    }

    const summary = calculateStudentFeeSummary(results);

    return NextResponse.json({
      success: true,
      count: results.length,
      data: {
        dues: results,
        summary,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
