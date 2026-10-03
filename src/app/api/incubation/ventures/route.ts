import { NextRequest, NextResponse } from "next/server";
import { MOCK_VENTURES } from "@/lib/incubation/incubation-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { IncubationVenture } from "@/types";

const activeVentures: IncubationVenture[] = [...MOCK_VENTURES];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sector = searchParams.get("sector");
    const stage = searchParams.get("stage");
    const q = searchParams.get("q");

    if (
      (sector && (containsSQLInjection(sector) || containsXSS(sector))) ||
      (stage && (containsSQLInjection(stage) || containsXSS(stage))) ||
      (q && (containsSQLInjection(q) || containsXSS(q)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid incubation venture parameters." },
        { status: 400 }
      );
    }

    let results = [...activeVentures];

    if (sector && sector !== "all") {
      const sanitizedSector = sanitizeInput(sector);
      results = results.filter((v) => v.sector.toLowerCase() === sanitizedSector.toLowerCase());
    }

    if (stage && stage !== "all") {
      const sanitizedStage = sanitizeInput(stage);
      results = results.filter((v) => v.stage.toLowerCase() === sanitizedStage.toLowerCase());
    }

    if (q && q.trim()) {
      const sanitizedQ = sanitizeInput(q).toLowerCase();
      results = results.filter(
        (v) =>
          v.venture_name.toLowerCase().includes(sanitizedQ) ||
          v.founder_name.toLowerCase().includes(sanitizedQ) ||
          v.sector.toLowerCase().includes(sanitizedQ)
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
    const { ventureName, sector, founderName, founderId, pitchDeckUrl } = body;

    if (!ventureName || !sector || !founderName || !founderId) {
      return NextResponse.json(
        { success: false, error: "Missing required founder application fields." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(ventureName) ||
      containsXSS(ventureName) ||
      containsSQLInjection(founderName) ||
      containsXSS(founderName)
    ) {
      return NextResponse.json(
        { success: false, error: "Suspicious characters in venture submission." },
        { status: 400 }
      );
    }

    const newVenture: IncubationVenture = {
      id: `ven-${Math.random().toString(36).substring(2, 10)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      venture_name: sanitizeInput(ventureName),
      sector: sector,
      founder_name: sanitizeInput(founderName),
      founder_id: sanitizeInput(founderId),
      founder_role: "Student Founder",
      pitch_deck_url: pitchDeckUrl ? sanitizeInput(pitchDeckUrl) : null,
      stage: "Ideation",
      valuation_inr: 10000000,
      seed_grant_inr: 250000,
      patents_filed: 0,
      status: "Applied",
      created_at: new Date().toISOString(),
    };

    activeVentures.unshift(newVenture);

    return NextResponse.json(
      {
        success: true,
        message: "Founder incubation application logged successfully. Screening committee review scheduled.",
        venture: newVenture,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
