import { NextRequest, NextResponse } from "next/server";
import { MOCK_AUDITORIUM_HALLS } from "@/lib/auditorium/auditorium-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { AuditoriumHall } from "@/types";

const activeHalls: AuditoriumHall[] = [...MOCK_AUDITORIUM_HALLS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const q = searchParams.get("q");

    if (
      (status && (containsSQLInjection(status) || containsXSS(status))) ||
      (q && (containsSQLInjection(q) || containsXSS(q)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid auditorium query parameters." },
        { status: 400 }
      );
    }

    let results = [...activeHalls];

    if (status && status !== "all") {
      const sanitizedStatus = sanitizeInput(status).toLowerCase();
      results = results.filter(
        (h) => h.current_status.toLowerCase() === sanitizedStatus
      );
    }

    if (q && q.trim()) {
      const sanitizedQ = sanitizeInput(q).toLowerCase();
      results = results.filter(
        (h) =>
          h.hall_name.toLowerCase().includes(sanitizedQ) ||
          h.venue_building.toLowerCase().includes(sanitizedQ) ||
          h.acoustic_rating.toLowerCase().includes(sanitizedQ)
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
    const { hallName, seatingCapacity, venueBuilding, acousticRating, stageDimensions, projectorType } = body;

    if (!hallName || !seatingCapacity || !venueBuilding) {
      return NextResponse.json(
        { success: false, error: "Missing required hall fields." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(hallName) ||
      containsXSS(hallName) ||
      containsSQLInjection(venueBuilding) ||
      containsXSS(venueBuilding)
    ) {
      return NextResponse.json(
        { success: false, error: "Security violation detected in hall payload." },
        { status: 400 }
      );
    }

    const newHall: AuditoriumHall = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      hall_name: sanitizeInput(hallName),
      seating_capacity: Number(seatingCapacity),
      venue_building: sanitizeInput(venueBuilding),
      acoustic_rating: acousticRating || "Dolby Atmos Pro Sound",
      stage_dimensions: stageDimensions || "45ft x 30ft Proscenium",
      projector_type: projectorType || "Laser 4K Christie Digital",
      current_status: "Available",
      created_at: new Date().toISOString(),
    };

    activeHalls.unshift(newHall);

    return NextResponse.json({
      success: true,
      data: newHall,
      message: "Auditorium hall registered successfully.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
