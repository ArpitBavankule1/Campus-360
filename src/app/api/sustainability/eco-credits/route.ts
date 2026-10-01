import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_ECO_CREDITS,
  generateEcoCertificateCode,
} from "@/lib/sustainability/sustainability-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { EcoCredit } from "@/types";

const activeCredits: EcoCredit[] = [...MOCK_ECO_CREDITS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const mode = searchParams.get("mode");
    const q = searchParams.get("q");

    if (
      (studentId && (containsSQLInjection(studentId) || containsXSS(studentId))) ||
      (mode && (containsSQLInjection(mode) || containsXSS(mode))) ||
      (q && (containsSQLInjection(q) || containsXSS(q)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid eco-credits query parameters." },
        { status: 400 }
      );
    }

    let results = [...activeCredits];

    if (mode && mode !== "all") {
      results = results.filter((c) => c.commute_mode === mode);
    }

    if (studentId) {
      results = results.filter((c) => c.student_id === studentId);
    }

    if (q && q.trim()) {
      const sanitizedQ = sanitizeInput(q).toLowerCase();
      results = results.filter(
        (c) =>
          c.student_name.toLowerCase().includes(sanitizedQ) ||
          c.certificate_code.toLowerCase().includes(sanitizedQ)
      );
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error("Eco credits GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch eco-credits." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { student_id, student_name, commute_mode, distance_km } = body;

    if (!student_id || !student_name || !commute_mode || distance_km === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required green commute parameters." },
        { status: 400 }
      );
    }

    if (containsSQLInjection(student_name) || containsXSS(student_name)) {
      return NextResponse.json(
        { success: false, error: "Malicious input detected in student name." },
        { status: 400 }
      );
    }

    const dist = Number(distance_km) || 1.0;
    // Emission factor: approx 0.21 kg CO2e / km saved vs petrol single-occupancy vehicle
    const co2Saved = Number((dist * 0.21).toFixed(2));
    const points = Math.round(dist * 10);
    const certCode = generateEcoCertificateCode();

    const newCredit: EcoCredit = {
      id: `eco-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      student_id: sanitizeInput(student_id),
      student_name: sanitizeInput(student_name),
      commute_mode,
      distance_km: dist,
      co2_saved_kg: co2Saved,
      eco_points_earned: points,
      certificate_code: certCode,
      logged_at: new Date().toISOString(),
    };

    activeCredits.unshift(newCredit);

    return NextResponse.json(
      {
        success: true,
        message: "Green commute logged successfully. Eco-warrior points added.",
        data: newCredit,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Eco credits POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to log eco credit." },
      { status: 500 }
    );
  }
}
