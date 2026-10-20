import { NextRequest, NextResponse } from "next/server";
import { getAisheEnrollment, addAisheEnrollmentRecord } from "@/lib/aishe/aishe-engine";
import { AisheProgrammeLevel } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const level = searchParams.get("level") as AisheProgrammeLevel | null;

    let records = getAisheEnrollment();
    if (level) {
      records = records.filter((r) => r.programme_level === level);
    }

    return NextResponse.json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch AISHE enrollment telemetry" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.programme_level || !body.discipline_name || !body.sanctioned_intake) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: programme_level, discipline_name, sanctioned_intake" },
        { status: 400 }
      );
    }

    const newRecord = addAisheEnrollmentRecord({
      survey_year: body.survey_year || "2025-2026",
      programme_level: body.programme_level,
      discipline_name: body.discipline_name,
      sanctioned_intake: Number(body.sanctioned_intake),
      enrolled_male: Number(body.enrolled_male) || 0,
      enrolled_female: Number(body.enrolled_female) || 0,
      enrolled_transgender: Number(body.enrolled_transgender) || 0,
      sc_count: Number(body.sc_count) || 0,
      st_count: Number(body.st_count) || 0,
      obc_count: Number(body.obc_count) || 0,
      general_count: Number(body.general_count) || 0,
      ews_count: Number(body.ews_count) || 0,
      pwd_count: Number(body.pwd_count) || 0,
      out_of_state_count: Number(body.out_of_state_count) || 0,
      foreign_national_count: Number(body.foreign_national_count) || 0,
    });

    return NextResponse.json({
      success: true,
      message: "Enrollment record added successfully",
      data: newRecord,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to add AISHE enrollment record" },
      { status: 500 }
    );
  }
}
