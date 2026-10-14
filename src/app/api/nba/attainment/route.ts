import { NextRequest, NextResponse } from "next/server";
import {
  getNbaCoPoMappings,
  getNbaCourseOutcomes,
  recordCourseOutcomeAttainment,
  calculateCoAttainment,
} from "@/lib/nba/nba-engine";
import { BloomLevel } from "@/types";

export async function GET() {
  try {
    const mappings = getNbaCoPoMappings();
    const courseOutcomes = getNbaCourseOutcomes();
    return NextResponse.json({
      success: true,
      data: {
        mappings,
        courseOutcomes,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch attainment data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      program_id,
      course_code,
      course_name,
      co_code,
      statement,
      bloom_level,
      direct_internal,
      direct_external,
      indirect_survey,
      faculty_in_charge,
      academic_year,
      semester,
    } = body;

    if (!course_code || !co_code || direct_internal === undefined || direct_external === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required fields for attainment computation" },
        { status: 400 }
      );
    }

    const calculatedScore = calculateCoAttainment(
      Number(direct_internal),
      Number(direct_external),
      Number(indirect_survey ?? 85)
    );

    const newRecord = recordCourseOutcomeAttainment({
      program_id: program_id || "prog-cse-01",
      course_code,
      course_name: course_name || "Course Assessment",
      co_code,
      statement: statement || "Course Outcome attainment recorded via audit portal.",
      bloom_level: (bloom_level as BloomLevel) || "Apply",
      direct_internal: Number(direct_internal),
      direct_external: Number(direct_external),
      indirect_survey: Number(indirect_survey ?? 85),
      academic_year: academic_year || "2025-2026",
      semester: Number(semester || 4),
      faculty_in_charge: faculty_in_charge || "Course Coordinator",
    });

    return NextResponse.json({
      success: true,
      data: newRecord,
      calculatedScore,
      message: `Course Outcome ${co_code} attainment recorded successfully (${calculatedScore}/3.00)`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to record attainment score" },
      { status: 500 }
    );
  }
}
