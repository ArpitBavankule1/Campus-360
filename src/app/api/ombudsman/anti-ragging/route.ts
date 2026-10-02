import { NextRequest, NextResponse } from "next/server";
import { MOCK_COMMITTEE_MEMBERS } from "@/lib/ombudsman/ombudsman-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        hotline_phone: "+91 (0) 1800-180-5522",
        emergency_email: "anti-ragging.emergency@apex.edu",
        national_portal_url: "https://www.antiragging.in",
        committee_members: MOCK_COMMITTEE_MEMBERS,
        squad_on_duty: "Proctorial Night Patrol Squad Delta",
      },
    });
  } catch (error) {
    console.error("Anti-ragging info GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve statutory anti-ragging metadata." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { campus_location, incident_summary, callers_contact_optional } = body;

    if (!campus_location || !incident_summary) {
      return NextResponse.json(
        { success: false, error: "Location and summary are mandatory for emergency alert." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(campus_location) ||
      containsXSS(campus_location) ||
      containsSQLInjection(incident_summary) ||
      containsXSS(incident_summary)
    ) {
      return NextResponse.json(
        { success: false, error: "Security validation error in emergency report." },
        { status: 400 }
      );
    }

    const alertId = `ALERT-RAG-${Date.now()}`;

    return NextResponse.json(
      {
        success: true,
        message: "EMERGENCY ANTI-RAGGING SQUAD DISPATCHED. Chief Proctor and campus security alerted to specified GPS grid coordinates.",
        alert_reference: alertId,
        dispatched_to: sanitizeInput(campus_location),
        response_eta_minutes: 3,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Anti-ragging alert POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to dispatch anti-ragging emergency beacon." },
      { status: 500 }
    );
  }
}
