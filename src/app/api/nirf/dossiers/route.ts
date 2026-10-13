import { NextRequest, NextResponse } from "next/server";
import { getNirfDossiers, createNirfDossier } from "@/lib/nirf/nirf-engine";
import { NirfCategory } from "@/types";

export async function GET() {
  try {
    const dossiers = getNirfDossiers();
    return NextResponse.json({
      success: true,
      data: dossiers,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch NIRF dossiers" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, academic_year, submitted_by, approving_authority } = body;

    if (!category || !academic_year || !submitted_by || !approving_authority) {
      return NextResponse.json(
        { success: false, error: "Missing required fields for NIRF dossier" },
        { status: 400 }
      );
    }

    const newDossier = createNirfDossier({
      category: category as NirfCategory,
      academic_year,
      submitted_by,
      approving_authority,
      composite_score: body.composite_score,
      projected_rank_range: body.projected_rank_range,
      previous_year_rank: body.previous_year_rank,
    });

    return NextResponse.json({
      success: true,
      data: newDossier,
      message: `Created NIRF dossier ${newDossier.dossier_code}`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create NIRF dossier" },
      { status: 500 }
    );
  }
}
