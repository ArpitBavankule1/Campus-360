import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_SCHOLARSHIPS,
  MOCK_SCHOLARSHIP_APPLICATIONS,
  checkScholarshipEligibility,
} from "@/lib/fees/fee-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { ScholarshipApplication } from "@/types";

const activeApplications: ScholarshipApplication[] = [...MOCK_SCHOLARSHIP_APPLICATIONS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("student_id") || "usr-demo-01";

    const myApplications = activeApplications.filter(
      (a) => a.student_id === studentId
    );

    return NextResponse.json({
      success: true,
      data: {
        scholarships: MOCK_SCHOLARSHIPS,
        myApplications,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      scholarship_id,
      student_id = "usr-demo-01",
      cgpa = 8.85,
      family_income = 450000,
      notes,
    } = body;

    if (!scholarship_id) {
      return NextResponse.json(
        { success: false, error: "scholarship_id is required." },
        { status: 400 }
      );
    }

    // Protection against injection attacks
    if (
      containsSQLInjection(scholarship_id) ||
      containsSQLInjection(notes || "") ||
      containsXSS(notes || "")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Malicious payload detected: SQL injection or script attempt blocked.",
        },
        { status: 400 }
      );
    }

    const scholarship = MOCK_SCHOLARSHIPS.find((s) => s.id === scholarship_id);
    if (!scholarship) {
      return NextResponse.json(
        { success: false, error: "Scholarship program not found." },
        { status: 404 }
      );
    }

    // Check duplicate application
    const existing = activeApplications.find(
      (a) => a.scholarship_id === scholarship_id && a.student_id === student_id
    );
    if (existing) {
      return NextResponse.json(
        { success: false, error: "You have already applied for this scholarship." },
        { status: 409 }
      );
    }

    // Eligibility check
    const eligibility = checkScholarshipEligibility(scholarship, {
      cgpa: Number(cgpa),
      familyIncome: Number(family_income),
    });

    if (!eligibility.isEligible) {
      return NextResponse.json(
        {
          success: false,
          error: `Scholarship application rejected: ${eligibility.reasons.join(". ")}`,
          reasons: eligibility.reasons,
        },
        { status: 403 }
      );
    }

    const newApp: ScholarshipApplication = {
      id: `sapp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      scholarship_id,
      student_id,
      college_id: scholarship.college_id,
      applied_at: new Date().toISOString(),
      status: "submitted",
      disbursed_amount: 0,
      notes: notes ? sanitizeInput(notes, 300) : "Application submitted with verified academic credentials.",
      scholarship,
    };

    activeApplications.unshift(newApp);

    return NextResponse.json(
      {
        success: true,
        message: `Scholarship application for ${scholarship.title} submitted successfully!`,
        data: newApp,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
