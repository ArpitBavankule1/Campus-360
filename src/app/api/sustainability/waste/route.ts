import { NextRequest, NextResponse } from "next/server";
import { MOCK_WASTE_AUDITS } from "@/lib/sustainability/sustainability-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { WasteAudit } from "@/types";

const activeWaste: WasteAudit[] = [...MOCK_WASTE_AUDITS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (q && (containsSQLInjection(q) || containsXSS(q))) {
      return NextResponse.json(
        { success: false, error: "Invalid audit query parameter." },
        { status: 400 }
      );
    }

    let results = [...activeWaste];

    if (q && q.trim()) {
      const sanitizedQ = sanitizeInput(q).toLowerCase();
      results = results.filter(
        (w) =>
          w.audit_week.toLowerCase().includes(sanitizedQ) ||
          w.auditor_officer.toLowerCase().includes(sanitizedQ) ||
          (w.remarks && w.remarks.toLowerCase().includes(sanitizedQ))
      );
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error("Waste audits GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch waste audit data." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      audit_week,
      organic_compost_kg,
      dry_recyclables_kg,
      electronic_waste_kg,
      landfill_waste_kg,
      auditor_officer,
      remarks,
    } = body;

    if (!audit_week || !auditor_officer) {
      return NextResponse.json(
        { success: false, error: "Missing required waste audit fields." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(audit_week) ||
      containsXSS(audit_week) ||
      containsSQLInjection(auditor_officer) ||
      containsXSS(auditor_officer)
    ) {
      return NextResponse.json(
        { success: false, error: "Security risk detected in audit submission." },
        { status: 400 }
      );
    }

    const org = Number(organic_compost_kg) || 0;
    const dry = Number(dry_recyclables_kg) || 0;
    const ewt = Number(electronic_waste_kg) || 0;
    const lnd = Number(landfill_waste_kg) || 0;
    const total = org + dry + ewt + lnd;
    const diversion = total > 0 ? Number((((org + dry + ewt) / total) * 100).toFixed(1)) : 85.0;

    const newAudit: WasteAudit = {
      id: `wst-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      audit_week: sanitizeInput(audit_week),
      organic_compost_kg: org,
      dry_recyclables_kg: dry,
      electronic_waste_kg: ewt,
      landfill_waste_kg: lnd,
      landfill_diversion_rate_percent: diversion,
      auditor_officer: sanitizeInput(auditor_officer),
      remarks: remarks ? sanitizeInput(remarks) : null,
      created_at: new Date().toISOString(),
    };

    activeWaste.unshift(newAudit);

    return NextResponse.json(
      {
        success: true,
        message: "Campus zero-waste audit recorded successfully.",
        data: newAudit,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Waste audits POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record waste audit." },
      { status: 500 }
    );
  }
}
