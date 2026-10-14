import { NextRequest, NextResponse } from "next/server";
import { getNbaSarDossiers, createNbaSarDossier } from "@/lib/nba/nba-engine";

export async function GET() {
  try {
    const sars = getNbaSarDossiers();
    return NextResponse.json({
      success: true,
      data: sars,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch NBA SAR dossiers" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { program_id, program_name, program_code, academic_year, coordinator_name } = body;

    if (!program_id || !program_name || !program_code || !academic_year || !coordinator_name) {
      return NextResponse.json(
        { success: false, error: "Missing required fields for SAR dossier filing" },
        { status: 400 }
      );
    }

    const newSar = createNbaSarDossier({
      program_id,
      program_name,
      program_code,
      academic_year,
      coordinator_name,
    });

    return NextResponse.json({
      success: true,
      data: newSar,
      message: `SAR Dossier ${newSar.sar_code} created successfully`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create SAR dossier" },
      { status: 500 }
    );
  }
}
