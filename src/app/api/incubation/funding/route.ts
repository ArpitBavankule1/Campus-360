import { NextRequest, NextResponse } from "next/server";
import { MOCK_FUNDING_TRANCHES } from "@/lib/incubation/incubation-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { VentureFundingTranche } from "@/types";

const activeTranches: VentureFundingTranche[] = [...MOCK_FUNDING_TRANCHES];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const investorType = searchParams.get("investorType");
    const status = searchParams.get("status");

    if (
      (investorType && (containsSQLInjection(investorType) || containsXSS(investorType))) ||
      (status && (containsSQLInjection(status) || containsXSS(status)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid funding query parameters." },
        { status: 400 }
      );
    }

    let results = [...activeTranches];

    if (investorType && investorType !== "all") {
      const sanitizedType = sanitizeInput(investorType);
      results = results.filter((t) => t.investor_type.toLowerCase() === sanitizedType.toLowerCase());
    }

    if (status && status !== "all") {
      const sanitizedStatus = sanitizeInput(status);
      results = results.filter((t) => t.disbursement_status.toLowerCase() === sanitizedStatus.toLowerCase());
    }

    const totalDisbursed = results
      .filter((t) => t.disbursement_status === "Disbursed")
      .reduce((sum, t) => sum + t.amount_inr, 0);

    return NextResponse.json({
      success: true,
      data: results,
      totalDisbursedInr: totalDisbursed,
      total: results.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ventureId, trancheName, amountInr, investorType } = body;

    if (!ventureId || !trancheName || !amountInr || !investorType) {
      return NextResponse.json(
        { success: false, error: "Missing required tranche grant details." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(trancheName) ||
      containsXSS(trancheName) ||
      containsSQLInjection(investorType)
    ) {
      return NextResponse.json(
        { success: false, error: "Suspicious characters detected in grant allocation." },
        { status: 400 }
      );
    }

    const newTranche: VentureFundingTranche = {
      id: `tra-${Math.random().toString(36).substring(2, 10)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      venture_id: ventureId,
      tranche_name: sanitizeInput(trancheName),
      amount_inr: Number(amountInr),
      investor_type: sanitizeInput(investorType),
      disbursement_date: new Date().toISOString().split("T")[0],
      milestone_verified: true,
      disbursement_status: "Approved",
      created_at: new Date().toISOString(),
    };

    activeTranches.unshift(newTranche);

    return NextResponse.json(
      {
        success: true,
        message: "Seed funding tranche approved and queued for escrow release.",
        tranche: newTranche,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
