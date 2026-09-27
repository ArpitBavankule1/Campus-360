import { NextRequest, NextResponse } from "next/server";
import { MOCK_STUDENT_HALL_TICKET } from "@/lib/exams/exam-engine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rollNumber = searchParams.get("roll_number");

    // Return official hall ticket
    const ticket = {
      ...MOCK_STUDENT_HALL_TICKET,
      roll_number: rollNumber || MOCK_STUDENT_HALL_TICKET.roll_number,
    };

    return NextResponse.json({
      success: true,
      data: ticket,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
