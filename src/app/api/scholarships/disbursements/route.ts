import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_DISBURSEMENTS,
  generateTrancheCode,
} from "@/lib/scholarships/scholarship-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { DisbursementTranche } from "@/types";

const activeDisbursements: DisbursementTranche[] = [...MOCK_DISBURSEMENTS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const scholarId = searchParams.get("scholarId");
    const status = searchParams.get("status");

    if (
      (scholarId && (containsSQLInjection(scholarId) || containsXSS(scholarId))) ||
      (status && (containsSQLInjection(status) || containsXSS(status)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid disbursement query parameters." },
        { status: 400 }
      );
    }

    let results = [...activeDisbursements];

    if (scholarId) {
      const sanitizedId = sanitizeInput(scholarId).toUpperCase();
      results = results.filter((d) => d.scholar_id === sanitizedId);
    }

    if (status && status !== "all") {
      const sanitizedStatus = sanitizeInput(status).toLowerCase();
      results = results.filter(
        (d) => d.status.toLowerCase() === sanitizedStatus
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
    const { scholarId, scholarName, schemeName, trancheNumber, amountInr } = body;

    if (!scholarId || !scholarName || !schemeName || !amountInr) {
      return NextResponse.json(
        { success: false, error: "Missing required disbursement fields." },
        { status: 400 }
      );
    }

    const randomBankRef = `UTR-SBIN-${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    const newTranche: DisbursementTranche = {
      id: `dbt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      tranche_code: generateTrancheCode(),
      scholar_id: sanitizeInput(scholarId),
      scholar_name: sanitizeInput(scholarName),
      scheme_name: sanitizeInput(schemeName),
      tranche_number: Number(trancheNumber) || 1,
      amount_inr: Number(amountInr),
      bank_ref_no: randomBankRef,
      disbursement_date: new Date().toISOString().split("T")[0],
      status: "Credited",
      created_at: new Date().toISOString(),
    };

    activeDisbursements.unshift(newTranche);

    return NextResponse.json({
      success: true,
      data: newTranche,
      message: "Direct Benefit Transfer tranche credited successfully.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
