import { NextRequest, NextResponse } from "next/server";
import { MOCK_GRANTS } from "@/lib/research/research-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { ResearchGrant, GrantAgency } from "@/types";

const activeGrants: ResearchGrant[] = [...MOCK_GRANTS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const agency = searchParams.get("agency");
    const status = searchParams.get("status");

    if (
      (agency && (containsSQLInjection(agency) || containsXSS(agency))) ||
      (status && (containsSQLInjection(status) || containsXSS(status)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid grant query parameters." },
        { status: 400 }
      );
    }

    let results = [...activeGrants];

    if (agency && agency !== "all") {
      results = results.filter((g) => g.funding_agency === agency);
    }
    if (status && status !== "all") {
      results = results.filter((g) => g.milestone_status === status);
    }

    const totalFunding = activeGrants.reduce(
      (sum, g) => sum + Number(g.total_grant_amount),
      0
    );
    const totalDisbursed = activeGrants.reduce(
      (sum, g) => sum + Number(g.disbursed_amount),
      0
    );

    return NextResponse.json({
      success: true,
      data: results,
      stats: {
        totalFunding,
        totalDisbursed,
        activeProjects: activeGrants.filter((g) => g.milestone_status === "ongoing").length,
      },
    });
  } catch (error) {
    console.error("Grants GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch research grants." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      project_title,
      principal_investigator,
      co_pis,
      funding_agency,
      total_grant_amount,
      start_date,
      end_date,
      deliverables_summary,
    } = body;

    const amount = Number(total_grant_amount);
    if (!project_title || !principal_investigator || !funding_agency || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Missing required research grant parameters." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(project_title) ||
      containsXSS(project_title) ||
      containsSQLInjection(principal_investigator)
    ) {
      return NextResponse.json(
        { success: false, error: "Unsafe inputs in grant registration." },
        { status: 400 }
      );
    }

    const newGrant: ResearchGrant = {
      id: `grn-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      project_title: sanitizeInput(project_title),
      principal_investigator: sanitizeInput(principal_investigator),
      co_pis: Array.isArray(co_pis)
        ? co_pis.map((p: string) => sanitizeInput(p))
        : [],
      funding_agency: (funding_agency as GrantAgency) || "DST",
      total_grant_amount: amount,
      disbursed_amount: Math.round(amount * 0.4),
      start_date: start_date || new Date().toISOString().split("T")[0],
      end_date: end_date || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      milestone_status: "ongoing",
      deliverables_summary: deliverables_summary ? sanitizeInput(deliverables_summary) : null,
      created_at: new Date().toISOString(),
    };

    activeGrants.unshift(newGrant);

    return NextResponse.json(
      {
        success: true,
        message: "Sponsored research grant project registered successfully!",
        data: newGrant,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Grant registration error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record research grant." },
      { status: 500 }
    );
  }
}
