import { NextRequest, NextResponse } from "next/server";
import {
  getAisheSurveys,
  getAisheSurveyById,
  updateAisheSurveyBlock,
} from "@/lib/aishe/aishe-engine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year");

    let surveys = getAisheSurveys();
    if (year) {
      surveys = surveys.filter((s) => s.survey_year === year);
    }

    return NextResponse.json({
      success: true,
      count: surveys.length,
      data: surveys,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch AISHE DCF surveys" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { surveyId, block, completed } = body;

    if (!surveyId || !block || typeof completed !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Missing required parameters: surveyId, block, completed" },
        { status: 400 }
      );
    }

    const updated = updateAisheSurveyBlock(surveyId, block, completed);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Survey not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "DCF survey block status updated",
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update DCF survey block" },
      { status: 500 }
    );
  }
}
