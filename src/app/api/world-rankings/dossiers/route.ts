import { NextRequest, NextResponse } from "next/server";
import {
  getWorldRankingDossiers,
  createWorldRankingDossier,
} from "@/lib/world-rankings/world-rankings-engine";

export async function GET() {
  try {
    const dossiers = getWorldRankingDossiers();
    return NextResponse.json({
      success: true,
      data: dossiers,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch world ranking dossiers" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { framework_code, cycle_name, data_submission_deadline, lead_compiler_name } = body;

    if (!framework_code || !cycle_name || !data_submission_deadline || !lead_compiler_name) {
      return NextResponse.json(
        { success: false, error: "Missing required dossier fields" },
        { status: 400 }
      );
    }

    const newDossier = createWorldRankingDossier({
      framework_code,
      cycle_name,
      edition_year: body.edition_year ? Number(body.edition_year) : 2026,
      data_submission_deadline,
      verified_publications_count: body.verified_publications_count ? Number(body.verified_publications_count) : undefined,
      international_academic_peers_nominated: body.international_academic_peers_nominated ? Number(body.international_academic_peers_nominated) : undefined,
      international_employers_nominated: body.international_employers_nominated ? Number(body.international_employers_nominated) : undefined,
      lead_compiler_name,
      notes: body.notes,
    });

    return NextResponse.json({
      success: true,
      message: `Dossier ${newDossier.dossier_code} registered under ${framework_code}`,
      data: newDossier,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create world ranking dossier" },
      { status: 500 }
    );
  }
}
