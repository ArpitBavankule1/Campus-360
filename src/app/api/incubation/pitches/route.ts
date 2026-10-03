import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_PITCHES,
  generatePitchSessionCode,
} from "@/lib/incubation/incubation-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { PitchSession } from "@/types";

const activePitches: PitchSession[] = [...MOCK_PITCHES];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionCode = searchParams.get("code");
    const verdict = searchParams.get("verdict");

    if (
      (sessionCode && (containsSQLInjection(sessionCode) || containsXSS(sessionCode))) ||
      (verdict && (containsSQLInjection(verdict) || containsXSS(verdict)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid pitch session query parameters." },
        { status: 400 }
      );
    }

    let results = [...activePitches];

    if (sessionCode) {
      const sanitizedCode = sanitizeInput(sessionCode).toUpperCase();
      results = results.filter((p) => p.session_code === sanitizedCode);
    }

    if (verdict && verdict !== "all") {
      const sanitizedVerdict = sanitizeInput(verdict);
      results = results.filter((p) => p.verdict.toLowerCase() === sanitizedVerdict.toLowerCase());
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
    const { ventureId, pitchDate, angelPanel } = body;

    if (!ventureId || !pitchDate) {
      return NextResponse.json(
        { success: false, error: "Missing mandatory demo day pitch booking information." },
        { status: 400 }
      );
    }

    const sessionCode = generatePitchSessionCode();
    const newPitch: PitchSession = {
      id: `pit-${Math.random().toString(36).substring(2, 10)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      session_code: sessionCode,
      venture_id: ventureId,
      pitch_date: pitchDate,
      angel_investor_panel: Array.isArray(angelPanel) && angelPanel.length > 0
        ? angelPanel.map((p: string) => sanitizeInput(p))
        : ["Apex Angel Network Syndicate", "Institutional Venture Chair"],
      venue: "Apex Incubation Boardroom & Webcast Suite",
      verdict: "Under Deliberation",
      created_at: new Date().toISOString(),
    };

    activePitches.unshift(newPitch);

    return NextResponse.json(
      {
        success: true,
        message: "Angel demo day pitch docket scheduled successfully.",
        pitch: newPitch,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
