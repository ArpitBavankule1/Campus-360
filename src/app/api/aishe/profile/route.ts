import { NextRequest, NextResponse } from "next/server";
import { getAisheProfile, updateAisheProfile } from "@/lib/aishe/aishe-engine";

export async function GET() {
  try {
    const profile = getAisheProfile();
    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch AISHE institutional profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = updateAisheProfile(body);
    return NextResponse.json({
      success: true,
      message: "AISHE profile updated successfully",
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update AISHE profile" },
      { status: 500 }
    );
  }
}
