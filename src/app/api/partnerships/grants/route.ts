import { NextRequest, NextResponse } from "next/server";
import { getSponsoredGrants, submitGrantProposal } from "@/lib/partnerships/partnerships-engine";
import { GrantStatus } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = (searchParams.get("status") as GrantStatus) || undefined;

    const grants = getSponsoredGrants(status);
    return NextResponse.json({
      success: true,
      data: grants,
      count: grants.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch sponsored research grants" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.project_title || !body.sponsor_name || !body.principal_investigator || !body.grant_amount_inr) {
      return NextResponse.json(
        { success: false, error: "Missing required fields for grant proposal" },
        { status: 400 }
      );
    }

    const grant = submitGrantProposal(body);
    return NextResponse.json({
      success: true,
      message: "Sponsored grant proposal registered successfully",
      data: grant,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to submit grant proposal" },
      { status: 500 }
    );
  }
}
