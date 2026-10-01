import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_PATENTS,
  generatePatentAppNumber,
} from "@/lib/research/research-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { PatentApplication, IPRType, PatentStatus } from "@/types";

const activePatents: PatentApplication[] = [...MOCK_PATENTS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const iprType = searchParams.get("type");

    if (
      (status && (containsSQLInjection(status) || containsXSS(status))) ||
      (iprType && (containsSQLInjection(iprType) || containsXSS(iprType)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid patent parameters." },
        { status: 400 }
      );
    }

    let results = [...activePatents];

    if (status && status !== "all") {
      results = results.filter((p) => p.status === status);
    }
    if (iprType && iprType !== "all") {
      results = results.filter((p) => p.ipr_type === iprType);
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error("Patents GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve patent filings." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, inventors, ipr_type, abstract, commercial_partner } = body;

    if (!title || !inventors || !abstract) {
      return NextResponse.json(
        { success: false, error: "Missing required patent filing metadata." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(title) ||
      containsXSS(title) ||
      containsSQLInjection(abstract)
    ) {
      return NextResponse.json(
        { success: false, error: "Unsafe inputs in patent filing." },
        { status: 400 }
      );
    }

    const appNumber = generatePatentAppNumber(ipr_type || "Patent");

    const newPatent: PatentApplication = {
      id: `pat-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      title: sanitizeInput(title),
      inventors: Array.isArray(inventors)
        ? inventors.map((i: string) => sanitizeInput(i))
        : [sanitizeInput(inventors)],
      application_number: appNumber,
      filing_date: new Date().toISOString().split("T")[0],
      status: "filed",
      ipr_type: (ipr_type as IPRType) || "Patent",
      abstract: sanitizeInput(abstract),
      commercial_partner: commercial_partner ? sanitizeInput(commercial_partner) : null,
      created_at: new Date().toISOString(),
    };

    activePatents.unshift(newPatent);

    return NextResponse.json(
      {
        success: true,
        message: `Intellectual Property application recorded under ${appNumber}!`,
        data: newPatent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Patent filing error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record patent application." },
      { status: 500 }
    );
  }
}
