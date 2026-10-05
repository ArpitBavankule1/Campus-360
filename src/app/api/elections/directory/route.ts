import { NextResponse } from "next/server";
import { MOCK_STUDENT_ELECTION } from "@/lib/elections/elections-engine";
import { StudentElection } from "@/types";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_STUDENT_ELECTION,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updatedElection: StudentElection = {
      ...MOCK_STUDENT_ELECTION,
      ...body,
      id: body.id || `elec-${Date.now()}`,
    };

    return NextResponse.json({
      success: true,
      message: "Election details updated successfully",
      data: updatedElection,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update election directory" },
      { status: 400 }
    );
  }
}
