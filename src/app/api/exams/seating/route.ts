import { NextRequest, NextResponse } from "next/server";
import { MOCK_SEATING_ALLOCATIONS } from "@/lib/exams/exam-engine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roll = searchParams.get("roll_number");
    const subject = searchParams.get("subject_code");
    const room = searchParams.get("room_number");

    let results = [...MOCK_SEATING_ALLOCATIONS];

    if (roll) {
      results = results.filter((s) =>
        s.roll_number.toLowerCase().includes(roll.toLowerCase())
      );
    }
    if (subject) {
      results = results.filter((s) =>
        s.subject_code.toLowerCase().includes(subject.toLowerCase())
      );
    }
    if (room) {
      results = results.filter((s) =>
        s.room_number.toLowerCase().includes(room.toLowerCase())
      );
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
