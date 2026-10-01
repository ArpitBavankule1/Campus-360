import { NextRequest, NextResponse } from "next/server";
import { MOCK_STARTUPS } from "@/lib/research/research-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { InnovationStartup, StartupSector, StartupFundingStage } from "@/types";

const activeStartups: InnovationStartup[] = [...MOCK_STARTUPS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sector = searchParams.get("sector");
    const stage = searchParams.get("stage");

    if (
      (sector && (containsSQLInjection(sector) || containsXSS(sector))) ||
      (stage && (containsSQLInjection(stage) || containsXSS(stage)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid startup parameters." },
        { status: 400 }
      );
    }

    let results = [...activeStartups];

    if (sector && sector !== "all") {
      results = results.filter((s) => s.sector === sector);
    }
    if (stage && stage !== "all") {
      results = results.filter((s) => s.funding_stage === stage);
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error("Startups GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve startup portfolio." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      startup_name,
      founder_name,
      founder_role,
      sector,
      description,
      website_url,
      pitch_deck_url,
    } = body;

    if (!startup_name || !founder_name || !sector || !description) {
      return NextResponse.json(
        { success: false, error: "Missing required startup application fields." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(startup_name) ||
      containsXSS(startup_name) ||
      containsSQLInjection(founder_name)
    ) {
      return NextResponse.json(
        { success: false, error: "Unsafe inputs in incubation application." },
        { status: 400 }
      );
    }

    const newStartup: InnovationStartup = {
      id: `stp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      startup_name: sanitizeInput(startup_name),
      founder_name: sanitizeInput(founder_name),
      founder_role: founder_role || "student",
      sector: (sector as StartupSector) || "AI/ML",
      funding_stage: "Idea",
      incubation_space: "T-Hub Incubation Suite",
      seed_grant_awarded: 500000,
      pitch_deck_url: pitch_deck_url ? sanitizeInput(pitch_deck_url) : null,
      website_url: website_url ? sanitizeInput(website_url) : null,
      description: sanitizeInput(description),
      created_at: new Date().toISOString(),
    };

    activeStartups.unshift(newStartup);

    return NextResponse.json(
      {
        success: true,
        message: "Startup incubation application submitted! Incubation review committee notified.",
        data: newStartup,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Startup application error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit startup application." },
      { status: 500 }
    );
  }
}
