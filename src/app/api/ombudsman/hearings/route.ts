import { NextRequest, NextResponse } from "next/server";
import { MOCK_HEARINGS } from "@/lib/ombudsman/ombudsman-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { GrievanceHearing } from "@/types";

const activeHearings: GrievanceHearing[] = [...MOCK_HEARINGS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    if (status && (containsSQLInjection(status) || containsXSS(status))) {
      return NextResponse.json(
        { success: false, error: "Invalid status query parameter." },
        { status: 400 }
      );
    }

    let results = [...activeHearings];

    if (status && status !== "all") {
      results = results.filter((h) => h.status === status);
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error("Grievance hearings GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch hearings docket." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      case_id,
      hearing_date,
      tribunal_venue,
      presiding_officer,
      quorum_present,
      hearing_notes,
    } = body;

    if (!case_id || !hearing_date || !tribunal_venue || !presiding_officer) {
      return NextResponse.json(
        { success: false, error: "Missing required hearing parameters." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(tribunal_venue) ||
      containsXSS(tribunal_venue) ||
      containsSQLInjection(presiding_officer) ||
      containsXSS(presiding_officer)
    ) {
      return NextResponse.json(
        { success: false, error: "Security risk detected in hearing schedule payload." },
        { status: 400 }
      );
    }

    const docketNumber = `DOCKET-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newHearing: GrievanceHearing = {
      id: `hrg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      case_id,
      docket_number: docketNumber,
      hearing_date,
      tribunal_venue: sanitizeInput(tribunal_venue),
      presiding_officer: sanitizeInput(presiding_officer),
      quorum_present: Array.isArray(quorum_present)
        ? quorum_present.map((q) => sanitizeInput(String(q)))
        : [sanitizeInput(presiding_officer)],
      hearing_notes: hearing_notes ? sanitizeInput(hearing_notes) : null,
      status: "Scheduled",
      created_at: new Date().toISOString(),
    };

    activeHearings.unshift(newHearing);

    return NextResponse.json(
      {
        success: true,
        message: "Ombudsman tribunal hearing scheduled successfully.",
        data: newHearing,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Hearings POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to schedule tribunal hearing." },
      { status: 500 }
    );
  }
}
