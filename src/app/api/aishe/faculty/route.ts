import { NextRequest, NextResponse } from "next/server";
import { getAisheFacultyCadres, addAisheFacultyCadre } from "@/lib/aishe/aishe-engine";
import { AisheCadreType } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cadre = searchParams.get("cadre") as AisheCadreType | null;

    let cadres = getAisheFacultyCadres();
    if (cadre) {
      cadres = cadres.filter((c) => c.cadre_type === cadre);
    }

    return NextResponse.json({
      success: true,
      count: cadres.length,
      data: cadres,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch AISHE faculty cadres" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.cadre_type || !body.sanctioned_posts) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: cadre_type, sanctioned_posts" },
        { status: 400 }
      );
    }

    const newCadre = addAisheFacultyCadre({
      survey_year: body.survey_year || "2025-2026",
      cadre_type: body.cadre_type,
      sanctioned_posts: Number(body.sanctioned_posts),
      regular_in_position: Number(body.regular_in_position) || 0,
      contractual_in_position: Number(body.contractual_in_position) || 0,
      male_faculty: Number(body.male_faculty) || 0,
      female_faculty: Number(body.female_faculty) || 0,
      phd_holders: Number(body.phd_holders) || 0,
      sc_faculty: Number(body.sc_faculty) || 0,
      st_faculty: Number(body.st_faculty) || 0,
      obc_faculty: Number(body.obc_faculty) || 0,
      general_faculty: Number(body.general_faculty) || 0,
      ews_faculty: Number(body.ews_faculty) || 0,
      pwd_faculty: Number(body.pwd_faculty) || 0,
    });

    return NextResponse.json({
      success: true,
      message: "Faculty cadre record added successfully",
      data: newCadre,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to add AISHE faculty cadre" },
      { status: 500 }
    );
  }
}
