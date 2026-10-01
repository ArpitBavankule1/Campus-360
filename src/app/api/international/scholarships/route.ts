import { NextRequest, NextResponse } from "next/server";
import { MOCK_INTERNATIONAL_SCHOLARSHIPS } from "@/lib/international/international-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { InternationalScholarship } from "@/types";

const activeScholarships: InternationalScholarship[] = [...MOCK_INTERNATIONAL_SCHOLARSHIPS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const coverage = searchParams.get("coverage");
    const q = searchParams.get("q");

    if (
      (coverage && (containsSQLInjection(coverage) || containsXSS(coverage))) ||
      (q && (containsSQLInjection(q) || containsXSS(q)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid scholarship query parameters." },
        { status: 400 }
      );
    }

    let results = [...activeScholarships];

    if (coverage && coverage !== "all") {
      results = results.filter((s) => s.coverage_type === coverage);
    }

    if (q && q.trim()) {
      const sanitizedQ = sanitizeInput(q).toLowerCase();
      results = results.filter(
        (s) =>
          s.fellowship_title.toLowerCase().includes(sanitizedQ) ||
          s.sponsoring_body.toLowerCase().includes(sanitizedQ) ||
          s.eligibility_criteria.toLowerCase().includes(sanitizedQ) ||
          s.target_countries.some((c) => c.toLowerCase().includes(sanitizedQ))
      );
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error("International scholarships GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch scholarships." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fellowship_title,
      sponsoring_body,
      coverage_type,
      award_amount_usd,
      target_countries,
      eligibility_criteria,
      application_deadline,
      open_slots,
    } = body;

    if (!fellowship_title || !sponsoring_body || !coverage_type || !eligibility_criteria) {
      return NextResponse.json(
        { success: false, error: "Missing required scholarship fellowship details." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(fellowship_title) ||
      containsXSS(fellowship_title) ||
      containsSQLInjection(sponsoring_body) ||
      containsXSS(sponsoring_body) ||
      containsSQLInjection(eligibility_criteria) ||
      containsXSS(eligibility_criteria)
    ) {
      return NextResponse.json(
        { success: false, error: "Malicious input detected in payload." },
        { status: 400 }
      );
    }

    const newScholarship: InternationalScholarship = {
      id: `sch-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      fellowship_title: sanitizeInput(fellowship_title),
      sponsoring_body: sanitizeInput(sponsoring_body),
      coverage_type,
      award_amount_usd: Number(award_amount_usd) || 10000.0,
      target_countries: Array.isArray(target_countries)
        ? target_countries.map((c) => sanitizeInput(String(c)))
        : ["Global"],
      eligibility_criteria: sanitizeInput(eligibility_criteria),
      application_deadline: sanitizeInput(application_deadline || "2026-11-30"),
      open_slots: Number(open_slots) || 2,
      status: "open",
      created_at: new Date().toISOString(),
    };

    activeScholarships.unshift(newScholarship);

    return NextResponse.json(
      {
        success: true,
        message: "International scholarship registered successfully.",
        data: newScholarship,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Scholarships POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to register scholarship." },
      { status: 500 }
    );
  }
}
