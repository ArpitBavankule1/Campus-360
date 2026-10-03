import { NextRequest, NextResponse } from "next/server";
import { MOCK_SPORTS_ARENAS } from "@/lib/sports/sports-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { SportsArena } from "@/types";

const activeArenas: SportsArena[] = [...MOCK_SPORTS_ARENAS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sportType = searchParams.get("sportType");
    const status = searchParams.get("status");
    const q = searchParams.get("q");

    if (
      (sportType && (containsSQLInjection(sportType) || containsXSS(sportType))) ||
      (status && (containsSQLInjection(status) || containsXSS(status))) ||
      (q && (containsSQLInjection(q) || containsXSS(q)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid sports arena query parameters." },
        { status: 400 }
      );
    }

    let results = [...activeArenas];

    if (sportType && sportType !== "all") {
      const sanitizedSport = sanitizeInput(sportType);
      results = results.filter((a) => a.sport_type.toLowerCase() === sanitizedSport.toLowerCase());
    }

    if (status && status !== "all") {
      const sanitizedStatus = sanitizeInput(status);
      results = results.filter((a) => a.current_status.toLowerCase() === sanitizedStatus.toLowerCase());
    }

    if (q && q.trim()) {
      const sanitizedQ = sanitizeInput(q).toLowerCase();
      results = results.filter(
        (a) =>
          a.arena_name.toLowerCase().includes(sanitizedQ) ||
          a.location_venue.toLowerCase().includes(sanitizedQ) ||
          a.sport_type.toLowerCase().includes(sanitizedQ)
      );
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
    const { arenaId, scholarName, date, timeSlot } = body;

    if (!arenaId || !scholarName || !date || !timeSlot) {
      return NextResponse.json(
        { success: false, error: "Missing mandatory reservation details." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(scholarName) ||
      containsXSS(scholarName) ||
      containsSQLInjection(timeSlot)
    ) {
      return NextResponse.json(
        { success: false, error: "Suspicious input detected in reservation parameters." },
        { status: 400 }
      );
    }

    const arena = activeArenas.find((a) => a.id === arenaId);
    if (!arena) {
      return NextResponse.json(
        { success: false, error: "Requested sports arena was not found." },
        { status: 404 }
      );
    }

    const reservationToken = `RES-COURT-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    return NextResponse.json(
      {
        success: true,
        message: `Court reserved successfully at ${arena.arena_name}`,
        reservation: {
          reservationToken,
          arenaName: arena.arena_name,
          sportType: arena.sport_type,
          venue: arena.location_venue,
          reservedBy: sanitizeInput(scholarName),
          date,
          timeSlot: sanitizeInput(timeSlot),
          status: "Confirmed",
          confirmedAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
