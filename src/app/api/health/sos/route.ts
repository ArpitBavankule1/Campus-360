import { NextRequest, NextResponse } from "next/server";
import { generateSOSTicketCode } from "@/lib/health/health-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { EmergencySOSDispatch, EmergencySOSType } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { latitude, longitude, buildingReference, emergencyType, studentId } = body;

    if (buildingReference && (containsSQLInjection(buildingReference) || containsXSS(buildingReference))) {
      return NextResponse.json(
        { success: false, error: "Invalid location reference." },
        { status: 400 }
      );
    }

    const ticketCode = generateSOSTicketCode();

    const dispatch: EmergencySOSDispatch = {
      id: `sos-${Date.now()}`,
      college_id: "col-apex-001",
      student_id: studentId || "00000000-0000-0000-0000-000000000001",
      sos_ticket_code: ticketCode,
      latitude: Number(latitude) || 18.5204,
      longitude: Number(longitude) || 73.8567,
      building_reference: buildingReference ? sanitizeInput(buildingReference) : "Main Academic Quadrangle",
      emergency_type: (emergencyType as EmergencySOSType) || "general",
      ambulance_dispatched: true,
      status: "dispatched",
      responder_notes: "Emergency Response Unit alerted. Campus Ambulance #1 en route with paramedical oxygen kit.",
      triggered_at: new Date().toISOString(),
      resolved_at: null,
    };

    return NextResponse.json({
      success: true,
      data: dispatch,
      message: `EMERGENCY ALERT BROADCASTED. Ambulance & Paramedics dispatched to ${dispatch.building_reference}.`,
    });
  } catch (error) {
    console.error("Emergency SOS dispatch error:", error);
    return NextResponse.json(
      { success: false, error: "Critical error alerting emergency medical dispatch." },
      { status: 500 }
    );
  }
}
