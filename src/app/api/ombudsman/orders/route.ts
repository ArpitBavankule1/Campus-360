import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_ORDERS,
  generateOrderSerialCode,
} from "@/lib/ombudsman/ombudsman-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { GrievanceResolutionOrder } from "@/types";

const activeOrders: GrievanceResolutionOrder[] = [...MOCK_ORDERS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const caseId = searchParams.get("caseId");

    if (
      (code && (containsSQLInjection(code) || containsXSS(code))) ||
      (caseId && (containsSQLInjection(caseId) || containsXSS(caseId)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid resolution order query parameters." },
        { status: 400 }
      );
    }

    let results = [...activeOrders];

    if (code) {
      const sanitizedCode = sanitizeInput(code).toUpperCase();
      results = results.filter((o) => o.order_serial_code === sanitizedCode);
    }

    if (caseId) {
      results = results.filter((o) => o.case_id === caseId);
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error("Resolution orders GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch grievance resolution orders." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      case_id,
      presiding_authority,
      findings_summary,
      mandatory_directives,
      compliance_deadline,
    } = body;

    if (
      !case_id ||
      !presiding_authority ||
      !findings_summary ||
      !mandatory_directives ||
      !compliance_deadline
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required order directive parameters." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(presiding_authority) ||
      containsXSS(presiding_authority) ||
      containsSQLInjection(findings_summary) ||
      containsXSS(findings_summary) ||
      containsSQLInjection(mandatory_directives) ||
      containsXSS(mandatory_directives)
    ) {
      return NextResponse.json(
        { success: false, error: "Security validation error in resolution order payload." },
        { status: 400 }
      );
    }

    const orderSerial = generateOrderSerialCode();
    const sealHash = `SEAL_0x${Math.random().toString(16).substring(2, 10).toUpperCase()}_OMBUDSMAN_CERTIFIED`;

    const newOrder: GrievanceResolutionOrder = {
      id: `ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      case_id,
      order_serial_code: orderSerial,
      presiding_authority: sanitizeInput(presiding_authority),
      findings_summary: sanitizeInput(findings_summary),
      mandatory_directives: sanitizeInput(mandatory_directives),
      compliance_deadline: sanitizeInput(compliance_deadline),
      is_statutory_binding: true,
      digital_seal_hash: sealHash,
      issued_at: new Date().toISOString(),
    };

    activeOrders.unshift(newOrder);

    return NextResponse.json(
      {
        success: true,
        message: "Binding ombudsman resolution order promulgated successfully.",
        data: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Resolution orders POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to promulgate resolution order." },
      { status: 500 }
    );
  }
}
