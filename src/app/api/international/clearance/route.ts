import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_TRAVEL_PASSES,
  generateTravelClearanceCode,
  generateDigitalQrToken,
} from "@/lib/international/international-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { TravelClearancePass } from "@/types";

const activePasses: TravelClearancePass[] = [...MOCK_TRAVEL_PASSES];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const code = searchParams.get("code");

    if (
      (studentId && (containsSQLInjection(studentId) || containsXSS(studentId))) ||
      (code && (containsSQLInjection(code) || containsXSS(code)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid travel clearance query parameters." },
        { status: 400 }
      );
    }

    let results = [...activePasses];

    if (code) {
      const sanitizedCode = sanitizeInput(code).toUpperCase();
      results = results.filter((p) => p.pass_code === sanitizedCode);
    }

    if (studentId) {
      results = results.filter((p) => p.student_id === studentId);
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error("Travel clearance GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch travel clearance passes." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      student_id,
      student_name,
      destination_country,
      host_institution,
      passport_number_masked,
      visa_type,
      valid_from,
      valid_until,
    } = body;

    if (
      !student_id ||
      !student_name ||
      !destination_country ||
      !host_institution ||
      !passport_number_masked ||
      !visa_type ||
      !valid_from ||
      !valid_until
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required travel clearance details." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(student_name) ||
      containsXSS(student_name) ||
      containsSQLInjection(destination_country) ||
      containsXSS(destination_country) ||
      containsSQLInjection(host_institution) ||
      containsXSS(host_institution) ||
      containsSQLInjection(passport_number_masked) ||
      containsXSS(passport_number_masked)
    ) {
      return NextResponse.json(
        { success: false, error: "Security risk detected in pass issuance request." },
        { status: 400 }
      );
    }

    const passCode = generateTravelClearanceCode();
    const qrToken = generateDigitalQrToken(passCode, student_id);

    const newPass: TravelClearancePass = {
      id: `tcp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      student_id: sanitizeInput(student_id),
      student_name: sanitizeInput(student_name),
      pass_code: passCode,
      destination_country: sanitizeInput(destination_country),
      host_institution: sanitizeInput(host_institution),
      passport_number_masked: sanitizeInput(passport_number_masked),
      visa_type,
      valid_from: sanitizeInput(valid_from),
      valid_until: sanitizeInput(valid_until),
      dean_approval_status: "approved",
      digital_qr_token: qrToken,
      created_at: new Date().toISOString(),
    };

    activePasses.unshift(newPass);

    return NextResponse.json(
      {
        success: true,
        message: "International travel clearance pass issued successfully.",
        data: newPass,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Travel clearance POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to issue travel clearance pass." },
      { status: 500 }
    );
  }
}
