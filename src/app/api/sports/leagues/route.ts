import { NextRequest, NextResponse } from "next/server";
import { MOCK_ATHLETIC_LEAGUES } from "@/lib/sports/sports-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { AthleticLeague } from "@/types";

const activeLeagues: AthleticLeague[] = [...MOCK_ATHLETIC_LEAGUES];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sportType = searchParams.get("sportType");
    const status = searchParams.get("status");

    if (
      (sportType && (containsSQLInjection(sportType) || containsXSS(sportType))) ||
      (status && (containsSQLInjection(status) || containsXSS(status)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid athletic league query parameters." },
        { status: 400 }
      );
    }

    let results = [...activeLeagues];

    if (sportType && sportType !== "all") {
      const sanitizedSport = sanitizeInput(sportType);
      results = results.filter((l) => l.sport_type.toLowerCase() === sanitizedSport.toLowerCase());
    }

    if (status && status !== "all") {
      const sanitizedStatus = sanitizeInput(status);
      results = results.filter((l) => l.status.toLowerCase() === sanitizedStatus.toLowerCase());
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
    const { tournamentId, teamName, captainName, contactEmail, playerRoster } = body;

    if (!tournamentId || !teamName || !captainName || !contactEmail) {
      return NextResponse.json(
        { success: false, error: "Missing required team registration fields." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(teamName) ||
      containsXSS(teamName) ||
      containsSQLInjection(captainName) ||
      containsXSS(captainName)
    ) {
      return NextResponse.json(
        { success: false, error: "Suspicious characters detected in registration parameters." },
        { status: 400 }
      );
    }

    const league = activeLeagues.find((l) => l.id === tournamentId);
    if (!league) {
      return NextResponse.json(
        { success: false, error: "Specified athletic tournament was not found." },
        { status: 404 }
      );
    }

    const registrationSlip = `REG-TEAM-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    return NextResponse.json(
      {
        success: true,
        message: `Team "${sanitizeInput(teamName)}" registered for ${league.tournament_title}`,
        registration: {
          registrationSlip,
          tournamentTitle: league.tournament_title,
          teamName: sanitizeInput(teamName),
          captain: sanitizeInput(captainName),
          email: sanitizeInput(contactEmail),
          rosterCount: Array.isArray(playerRoster) ? playerRoster.length : 1,
          status: "Entry Accepted",
          registeredAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
