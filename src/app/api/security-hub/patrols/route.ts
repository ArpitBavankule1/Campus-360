import { NextRequest, NextResponse } from "next/server";
import { MOCK_PATROLS } from "@/lib/security-hub/security-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { PatrolCheckpoint } from "@/types";

const activePatrols: PatrolCheckpoint[] = [...MOCK_PATROLS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    if (status && (containsSQLInjection(status) || containsXSS(status))) {
      return NextResponse.json(
        { success: false, error: "Invalid patrol query parameters." },
        { status: 400 }
      );
    }

    let results = [...activePatrols];

    if (status && status !== "all") {
      const sanitizedStatus = sanitizeInput(status);
      results = results.filter((p) => p.status.toLowerCase() === sanitizedStatus.toLowerCase());
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
    const { routeName, checkpointMarker, guardName, status } = body;

    if (!routeName || !checkpointMarker || !guardName) {
      return NextResponse.json(
        { success: false, error: "Missing required patrol checkpoint parameters." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(routeName) ||
      containsXSS(routeName) ||
      containsSQLInjection(guardName) ||
      containsXSS(guardName)
    ) {
      return NextResponse.json(
        { success: false, error: "Suspicious characters in patrol telemetry log." },
        { status: 400 }
      );
    }

    const newCheckpoint: PatrolCheckpoint = {
      id: `pat-${Math.random().toString(36).substring(2, 10)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      route_name: sanitizeInput(routeName),
      checkpoint_marker: sanitizeInput(checkpointMarker),
      guard_name: sanitizeInput(guardName),
      last_patrolled_at: new Date().toISOString(),
      status: status || "Normal Secure",
      created_at: new Date().toISOString(),
    };

    activePatrols.unshift(newCheckpoint);

    return NextResponse.json(
      {
        success: true,
        message: "Patrol checkpoint scan verified via NFC telemetry beacon.",
        checkpoint: newCheckpoint,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
