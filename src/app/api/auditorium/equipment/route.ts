import { NextRequest, NextResponse } from "next/server";
import { MOCK_STAGE_EQUIPMENT_RIDERS } from "@/lib/auditorium/auditorium-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { StageEquipmentRider } from "@/types";

const activeRiders: StageEquipmentRider[] = [...MOCK_STAGE_EQUIPMENT_RIDERS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    if (status && (containsSQLInjection(status) || containsXSS(status))) {
      return NextResponse.json(
        { success: false, error: "Invalid equipment rider query parameter." },
        { status: 400 }
      );
    }

    let results = [...activeRiders];

    if (status && status !== "all") {
      const sanitizedStatus = sanitizeInput(status).toLowerCase();
      results = results.filter(
        (r) => r.status.toLowerCase() === sanitizedStatus
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
    const { equipmentType, quantity, technicianAssigned } = body;

    if (!equipmentType || !quantity) {
      return NextResponse.json(
        { success: false, error: "Missing required equipment rider fields." },
        { status: 400 }
      );
    }

    const newRider: StageEquipmentRider = {
      id: `eqr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      equipment_type: equipmentType,
      quantity: Number(quantity),
      technician_assigned: technicianAssigned ? sanitizeInput(technicianAssigned) : "Chief AV Engineer",
      status: "Dispatched",
      created_at: new Date().toISOString(),
    };

    activeRiders.unshift(newRider);

    return NextResponse.json({
      success: true,
      data: newRider,
      message: "AV stage equipment rider dispatched successfully.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
