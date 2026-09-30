import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_OUT_PASSES,
  generateOutPassCode,
  validateOutPassRequest,
} from "@/lib/hostel/hostel-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { HostelOutPass, OutPassStatus } from "@/types";

const activeOutPasses: HostelOutPass[] = [...MOCK_OUT_PASSES];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const studentId = searchParams.get("student_id");

    if (
      (status && (containsSQLInjection(status) || containsXSS(status))) ||
      (studentId && (containsSQLInjection(studentId) || containsXSS(studentId)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid query parameter." },
        { status: 400 }
      );
    }

    let results = [...activeOutPasses];

    if (status && status !== "all") {
      const sanitizedStatus = sanitizeInput(status).toLowerCase();
      results = results.filter((p) => p.status === sanitizedStatus);
    }

    if (studentId) {
      const sanitizedStudent = sanitizeInput(studentId);
      results = results.filter((p) => p.student_id === sanitizedStudent);
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error("Out-passes fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve out-pass requests." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { destination, reason, departureTime, expectedReturn, parentContact, studentId } = body;

    // Anti-injection checks
    if (
      (destination && (containsSQLInjection(destination) || containsXSS(destination))) ||
      (reason && (containsSQLInjection(reason) || containsXSS(reason))) ||
      (parentContact && (containsSQLInjection(parentContact) || containsXSS(parentContact)))
    ) {
      return NextResponse.json(
        { success: false, error: "Malicious characters detected in out-pass request." },
        { status: 400 }
      );
    }

    const validation = validateOutPassRequest({
      destination,
      reason,
      departureTime,
      expectedReturn,
      parentContact,
    });

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const newPass: HostelOutPass = {
      id: `op-${Date.now()}`,
      college_id: "col-apex-001",
      student_id: studentId || "00000000-0000-0000-0000-000000000001",
      pass_code: generateOutPassCode(),
      destination: sanitizeInput(destination),
      reason: sanitizeInput(reason),
      departure_time: new Date(departureTime).toISOString(),
      expected_return: new Date(expectedReturn).toISOString(),
      actual_return: null,
      parent_contact: sanitizeInput(parentContact),
      parent_consent_verified: true,
      status: "approved",
      warden_remarks: "Automated digital pass issued with verified parent telephonic consent.",
      created_at: new Date().toISOString(),
    };

    activeOutPasses.unshift(newPass);

    return NextResponse.json({
      success: true,
      data: newPass,
      message: "Out-pass successfully requested and approved.",
    });
  } catch (error) {
    console.error("Out-pass submission error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process out-pass submission." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { passId, status, wardenRemarks } = body;

    if (!passId || !status) {
      return NextResponse.json(
        { success: false, error: "Pass ID and updated status are required." },
        { status: 400 }
      );
    }

    const passIndex = activeOutPasses.findIndex((p) => p.id === passId || p.pass_code === passId);
    if (passIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Out-pass record not found." },
        { status: 404 }
      );
    }

    activeOutPasses[passIndex] = {
      ...activeOutPasses[passIndex],
      status: status as OutPassStatus,
      warden_remarks: wardenRemarks ? sanitizeInput(wardenRemarks) : activeOutPasses[passIndex].warden_remarks,
      actual_return: status === "returned" ? new Date().toISOString() : activeOutPasses[passIndex].actual_return,
    };

    return NextResponse.json({
      success: true,
      data: activeOutPasses[passIndex],
      message: "Out-pass status updated successfully.",
    });
  } catch (error) {
    console.error("Out-pass update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update out-pass record." },
      { status: 500 }
    );
  }
}
