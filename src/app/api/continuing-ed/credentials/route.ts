import { NextRequest, NextResponse } from "next/server";
import { getMicroCredentials, issueMicroCredentialEnrollment } from "@/lib/continuing-ed/continuing-ed-engine";
import { CompetencyDomain } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = (searchParams.get("domain") as CompetencyDomain) || undefined;

    const credentials = getMicroCredentials(domain);
    return NextResponse.json({
      success: true,
      data: credentials,
      count: credentials.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch professional micro-credentials" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.badge_title || !body.competency_domain || !body.issuing_board || !body.ceu_credits) {
      return NextResponse.json(
        { success: false, error: "Missing required fields for micro-credential badge" },
        { status: 400 }
      );
    }

    const credential = issueMicroCredentialEnrollment(body);
    return NextResponse.json(
      {
        success: true,
        message: "Professional micro-credential launched successfully",
        data: credential,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to issue micro-credential" },
      { status: 500 }
    );
  }
}
