import { NextRequest, NextResponse } from "next/server";
import { getPmUshaProfile, updatePmUshaProfile } from "@/lib/pm-usha/pm-usha-engine";

export async function GET() {
  try {
    const profile = getPmUshaProfile();
    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch PM-USHA institutional profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = updatePmUshaProfile(body);
    return NextResponse.json({
      success: true,
      message: "PM-USHA institutional profile updated successfully",
      data: updated,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update PM-USHA profile" },
      { status: 500 }
    );
  }
}
