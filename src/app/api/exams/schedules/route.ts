import { NextRequest, NextResponse } from "next/server";
import { MOCK_EXAM_SCHEDULES } from "@/lib/exams/exam-engine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const semester = searchParams.get("semester");
    const type = searchParams.get("type");

    let results = [...MOCK_EXAM_SCHEDULES];

    if (semester) {
      results = results.filter((s) =>
        s.semester.toLowerCase().includes(semester.toLowerCase())
      );
    }
    if (type) {
      results = results.filter((s) => s.exam_type === type);
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
