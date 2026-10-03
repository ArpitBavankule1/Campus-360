import { NextRequest, NextResponse } from "next/server";
import { MOCK_TURNSTILE_LOGS } from "@/lib/security-hub/security-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { TurnstileLog } from "@/types";

const activeLogs: TurnstileLog[] = [...MOCK_TURNSTILE_LOGS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const anomaliesOnly = searchParams.get("anomaliesOnly");
    const role = searchParams.get("role");

    if (
      (role && (containsSQLInjection(role) || containsXSS(role)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid turnstile log parameters." },
        { status: 400 }
      );
    }

    let results = [...activeLogs];

    if (anomaliesOnly === "true") {
      results = results.filter((l) => l.anomaly_flag);
    }

    if (role && role !== "all") {
      const sanitizedRole = sanitizeInput(role);
      results = results.filter((l) => l.user_role.toLowerCase() === sanitizedRole.toLowerCase());
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
    const { checkpointName, cardHash, userRole, accessResult, anomalyFlag } = body;

    if (!checkpointName || !cardHash) {
      return NextResponse.json(
        { success: false, error: "Missing required turnstile tap telemetry." },
        { status: 400 }
      );
    }

    const newLog: TurnstileLog = {
      id: `log-${Math.random().toString(36).substring(2, 10)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      checkpoint_name: sanitizeInput(checkpointName),
      card_hash: sanitizeInput(cardHash),
      user_role: userRole || "student",
      access_result: accessResult || "Granted",
      anomaly_flag: Boolean(anomalyFlag),
      tap_time: new Date().toISOString(),
    };

    activeLogs.unshift(newLog);

    return NextResponse.json(
      {
        success: true,
        message: "Turnstile tap recorded in campus security telemetry stream.",
        log: newLog,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
