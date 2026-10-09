import { NextRequest, NextResponse } from "next/server";
import { getFellowshipDisbursements } from "@/lib/fellowships/fellowships-engine";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("student_id") || undefined;
    const disbursements = getFellowshipDisbursements(studentId);

    return NextResponse.json({
      success: true,
      data: disbursements,
      count: disbursements.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch stipend disbursements" },
      { status: 500 }
    );
  }
}
