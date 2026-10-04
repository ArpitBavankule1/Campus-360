import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_SCHOLARSHIP_APPLICATIONS,
  generateScholarshipAppCode,
} from "@/lib/scholarships/scholarship-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { ScholarshipApplication } from "@/types";

const activeApplications: ScholarshipApplication[] = [
  ...MOCK_SCHOLARSHIP_APPLICATIONS,
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const appCode = searchParams.get("appCode");
    const status = searchParams.get("status");

    if (
      (appCode && (containsSQLInjection(appCode) || containsXSS(appCode))) ||
      (status && (containsSQLInjection(status) || containsXSS(status)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid application query parameters." },
        { status: 400 }
      );
    }

    let results = [...activeApplications];

    if (appCode) {
      const sanitizedCode = sanitizeInput(appCode).toUpperCase();
      results = results.filter((a) => a.application_code === sanitizedCode);
    }

    if (status && status !== "all") {
      const sanitizedStatus = sanitizeInput(status).toLowerCase();
      results = results.filter(
        (a) => a.status.toLowerCase() === sanitizedStatus
      );
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      schemeName,
      scholarId,
      scholarName,
      department,
      currentCgpa,
      annualFamilyIncomeInr,
      statementOfPurpose,
    } = body;

    if (!schemeName || !scholarName || !currentCgpa || !annualFamilyIncomeInr) {
      return NextResponse.json(
        { success: false, error: "Missing required application parameters." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(schemeName) ||
      containsXSS(schemeName) ||
      containsSQLInjection(scholarName) ||
      containsXSS(scholarName)
    ) {
      return NextResponse.json(
        { success: false, error: "Security violation detected in application payload." },
        { status: 400 }
      );
    }

    const newApp: ScholarshipApplication = {
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      application_code: generateScholarshipAppCode(),
      scheme_name: sanitizeInput(schemeName),
      scholar_id: scholarId || "SCH-2026-8819",
      scholar_name: sanitizeInput(scholarName),
      department: department ? sanitizeInput(department) : "Computer Science & Engineering",
      current_cgpa: Number(currentCgpa),
      annual_family_income_inr: Number(annualFamilyIncomeInr),
      status: "Submitted",
      statement_of_purpose: statementOfPurpose ? sanitizeInput(statementOfPurpose) : null,
      created_at: new Date().toISOString(),
    };

    activeApplications.unshift(newApp);

    return NextResponse.json({
      success: true,
      data: newApp,
      message: "Scholarship application submitted to Academic Scrutiny Board.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
