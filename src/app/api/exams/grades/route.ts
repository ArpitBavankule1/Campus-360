import { NextRequest, NextResponse } from "next/server";
import { MOCK_SEMESTER_5_TRANSCRIPT } from "@/lib/exams/exam-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";

let currentTranscript = { ...MOCK_SEMESTER_5_TRANSCRIPT };

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const semester = searchParams.get("semester");

    if (semester && (containsSQLInjection(semester) || containsXSS(semester))) {
      return NextResponse.json(
        { success: false, error: "Invalid parameter format." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: currentTranscript,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subject_code, revaluation_type = "photocopy_and_recheck" } = body;

    if (!subject_code) {
      return NextResponse.json(
        { success: false, error: "Subject code is required" },
        { status: 400 }
      );
    }

    // Protection against SQL injection and script injection
    if (
      containsSQLInjection(subject_code) ||
      containsSQLInjection(revaluation_type) ||
      containsXSS(subject_code) ||
      containsXSS(revaluation_type)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Malicious payload detected: SQL injection or script attempt blocked.",
        },
        { status: 400 }
      );
    }

    const cleanSubjectCode = sanitizeInput(subject_code, 20);

    // Mark subject as under revaluation
    currentTranscript.records = currentTranscript.records.map((r) =>
      r.subject_code === subject_code
        ? { ...r, status: "under_revaluation" as const }
        : r
    );

    return NextResponse.json({
      success: true,
      message: `Revaluation request for ${subject_code} submitted successfully. Tracking Token: REV-${Date.now().toString().slice(-6)}`,
      data: currentTranscript,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
