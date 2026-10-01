import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_TRANSPORT_PASSES,
  MOCK_ROUTES,
  generateTransportPassCode,
} from "@/lib/transport/transport-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { TransportPass, TransportPassType } from "@/types";

const activePasses: TransportPass[] = [...MOCK_TRANSPORT_PASSES];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const scholarId = searchParams.get("scholar_id");
    const code = searchParams.get("code");

    if (
      (scholarId && (containsSQLInjection(scholarId) || containsXSS(scholarId))) ||
      (code && (containsSQLInjection(code) || containsXSS(code)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid transport pass query parameters." },
        { status: 400 }
      );
    }

    let results = [...activePasses];

    if (scholarId) {
      results = results.filter((p) => p.scholar_id === scholarId);
    }
    if (code) {
      results = results.filter((p) => p.pass_code === code);
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error("Transport passes GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve transport passes." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scholar_id, scholar_name, pass_type, route_id } = body;

    if (!scholar_id || !scholar_name || !pass_type) {
      return NextResponse.json(
        { success: false, error: "Missing required pass issuance attributes." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(scholar_name) ||
      containsXSS(scholar_name) ||
      containsSQLInjection(pass_type)
    ) {
      return NextResponse.json(
        { success: false, error: "Unsafe inputs in transport pass request." },
        { status: 400 }
      );
    }

    const route = MOCK_ROUTES.find((r) => r.id === route_id) || MOCK_ROUTES[0];
    const passCode = generateTransportPassCode(route.route_code);

    const newPass: TransportPass = {
      id: `pas-trn-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      scholar_id: sanitizeInput(scholar_id),
      scholar_name: sanitizeInput(scholar_name),
      pass_type: (pass_type as TransportPassType) || "semester_unlimited",
      pass_code: passCode,
      route_id: route.id,
      valid_from: new Date().toISOString().split("T")[0],
      valid_to: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "active",
      created_at: new Date().toISOString(),
      route,
    };

    activePasses.unshift(newPass);

    return NextResponse.json(
      {
        success: true,
        message: "Digital campus transport pass issued successfully!",
        data: newPass,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Pass issuance error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to issue transport pass." },
      { status: 500 }
    );
  }
}
