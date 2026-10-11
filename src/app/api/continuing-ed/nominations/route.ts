import { NextRequest, NextResponse } from "next/server";
import { getCorporateNominations, submitCorporateNomination } from "@/lib/continuing-ed/continuing-ed-engine";

export async function GET() {
  try {
    const nominations = getCorporateNominations();
    return NextResponse.json({
      success: true,
      data: nominations,
      count: nominations.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch corporate nominations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.program_id || !body.corporate_sponsor || !body.participant_name || !body.participant_email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields for corporate nomination" },
        { status: 400 }
      );
    }

    const nomination = submitCorporateNomination(body);
    return NextResponse.json(
      {
        success: true,
        message: "Corporate executive nomination submitted successfully",
        data: nomination,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to submit corporate nomination" },
      { status: 500 }
    );
  }
}
