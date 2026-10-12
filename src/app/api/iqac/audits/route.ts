import { NextRequest, NextResponse } from "next/server";
import { getIqacOverviewStats, scheduleAcademicAudit } from "@/lib/iqac/iqac-engine";
import { AuditType } from "@/types";

export async function GET() {
  try {
    const stats = getIqacOverviewStats();
    return NextResponse.json({
      success: true,
      data: stats.audits,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch academic audits" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      audit_title,
      audit_type,
      target_department,
      lead_external_auditor,
      external_auditor_affiliation,
      internal_co_auditor,
      scheduled_date,
    } = body;

    if (!audit_title || !target_department || !lead_external_auditor || !scheduled_date) {
      return NextResponse.json(
        { success: false, error: "Missing required audit fields" },
        { status: 400 }
      );
    }

    const audit = scheduleAcademicAudit({
      audit_title,
      audit_type: (audit_type as AuditType) || "academic",
      target_department,
      lead_external_auditor,
      external_auditor_affiliation: external_auditor_affiliation || "Independent Accreditation Reviewer",
      internal_co_auditor: internal_co_auditor || "IQAC Coordinator",
      scheduled_date,
    });

    return NextResponse.json({
      success: true,
      data: audit,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to schedule academic audit" },
      { status: 500 }
    );
  }
}
