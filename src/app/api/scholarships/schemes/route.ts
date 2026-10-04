import { NextRequest, NextResponse } from "next/server";
import { MOCK_SCHOLARSHIP_SCHEMES } from "@/lib/scholarships/scholarship-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { ScholarshipScheme } from "@/types";

const activeSchemes: ScholarshipScheme[] = [...MOCK_SCHOLARSHIP_SCHEMES];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const provider = searchParams.get("provider");
    const status = searchParams.get("status");
    const q = searchParams.get("q");

    if (
      (provider && (containsSQLInjection(provider) || containsXSS(provider))) ||
      (status && (containsSQLInjection(status) || containsXSS(status))) ||
      (q && (containsSQLInjection(q) || containsXSS(q)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid scholarship query parameters." },
        { status: 400 }
      );
    }

    let results = [...activeSchemes];

    if (provider && provider !== "all") {
      const sanitizedProv = sanitizeInput(provider).toLowerCase();
      results = results.filter(
        (s) => s.provider_type.toLowerCase() === sanitizedProv
      );
    }

    if (status && status !== "all") {
      const sanitizedStatus = sanitizeInput(status).toLowerCase();
      results = results.filter(
        (s) => s.status.toLowerCase() === sanitizedStatus
      );
    }

    if (q && q.trim()) {
      const sanitizedQ = sanitizeInput(q).toLowerCase();
      results = results.filter(
        (s) =>
          s.scheme_name.toLowerCase().includes(sanitizedQ) ||
          s.provider_type.toLowerCase().includes(sanitizedQ)
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
    const { schemeName, providerType, amountPerScholarInr, totalBudgetInr, minCgpa, maxFamilyIncomeLpa, applicationDeadline } = body;

    if (!schemeName || !providerType || !amountPerScholarInr) {
      return NextResponse.json(
        { success: false, error: "Missing required scholarship scheme fields." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(schemeName) ||
      containsXSS(schemeName)
    ) {
      return NextResponse.json(
        { success: false, error: "Security violation detected in scheme payload." },
        { status: 400 }
      );
    }

    const newScheme: ScholarshipScheme = {
      id: `sch-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      scheme_name: sanitizeInput(schemeName),
      provider_type: providerType,
      amount_per_scholar_inr: Number(amountPerScholarInr),
      total_budget_inr: Number(totalBudgetInr) || Number(amountPerScholarInr) * 10,
      disbursed_budget_inr: 0,
      min_cgpa: Number(minCgpa) || 7.5,
      max_family_income_lpa: Number(maxFamilyIncomeLpa) || 8.0,
      application_deadline: applicationDeadline || "2026-11-30",
      status: "Applications Open",
      created_at: new Date().toISOString(),
    };

    activeSchemes.unshift(newScheme);

    return NextResponse.json({
      success: true,
      data: newScheme,
      message: "Scholarship scheme published successfully.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
