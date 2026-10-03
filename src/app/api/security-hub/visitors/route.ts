import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_VISITOR_PASSES,
  generateVisitorPassCode,
} from "@/lib/security-hub/security-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { VisitorPass } from "@/types";

const activeVisitors: VisitorPass[] = [...MOCK_VISITOR_PASSES];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const passCode = searchParams.get("passCode");
    const status = searchParams.get("status");
    const q = searchParams.get("q");

    if (
      (passCode && (containsSQLInjection(passCode) || containsXSS(passCode))) ||
      (status && (containsSQLInjection(status) || containsXSS(status))) ||
      (q && (containsSQLInjection(q) || containsXSS(q)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid visitor pass query parameters." },
        { status: 400 }
      );
    }

    let results = [...activeVisitors];

    if (passCode) {
      const sanitizedCode = sanitizeInput(passCode).toUpperCase();
      results = results.filter((v) => v.pass_code === sanitizedCode);
    }

    if (status && status !== "all") {
      const sanitizedStatus = sanitizeInput(status);
      results = results.filter((v) => v.status.toLowerCase() === sanitizedStatus.toLowerCase());
    }

    if (q && q.trim()) {
      const sanitizedQ = sanitizeInput(q).toLowerCase();
      results = results.filter(
        (v) =>
          v.visitor_name.toLowerCase().includes(sanitizedQ) ||
          v.host_person.toLowerCase().includes(sanitizedQ) ||
          v.pass_code.toLowerCase().includes(sanitizedQ)
      );
    }

    return NextResponse.json({
      success: true,
      data: results,
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
    const {
      visitorName,
      visitorPhone,
      visitorIdProof,
      visitingPurpose,
      hostPerson,
      entryGate,
      validDate,
      vehicleNumber,
    } = body;

    if (!visitorName || !visitorPhone || !visitorIdProof || !visitingPurpose || !hostPerson) {
      return NextResponse.json(
        { success: false, error: "Missing required visitor pass parameters." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(visitorName) ||
      containsXSS(visitorName) ||
      containsSQLInjection(hostPerson) ||
      containsXSS(hostPerson)
    ) {
      return NextResponse.json(
        { success: false, error: "Suspicious characters in visitor application." },
        { status: 400 }
      );
    }

    const passCode = generateVisitorPassCode();
    const newVisitor: VisitorPass = {
      id: `vis-${Math.random().toString(36).substring(2, 10)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      pass_code: passCode,
      visitor_name: sanitizeInput(visitorName),
      visitor_phone: sanitizeInput(visitorPhone),
      visitor_id_proof: sanitizeInput(visitorIdProof),
      visiting_purpose: visitingPurpose,
      host_person: sanitizeInput(hostPerson),
      entry_gate: entryGate || "Main Gate 1 (North Arch)",
      valid_date: validDate || new Date().toISOString().split("T")[0],
      status: "Pre-Registered",
      vehicle_number: vehicleNumber ? sanitizeInput(vehicleNumber) : null,
      issued_at: new Date().toISOString(),
    };

    activeVisitors.unshift(newVisitor);

    return NextResponse.json(
      {
        success: true,
        message: "Visitor pass issued with cryptographic gate QR token.",
        pass: newVisitor,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
