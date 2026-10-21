import { NextRequest, NextResponse } from "next/server";
import { getSwayamChapter, updateSwayamChapter } from "@/lib/swayam/swayam-engine";

export async function GET() {
  try {
    const chapter = getSwayamChapter();
    return NextResponse.json({
      success: true,
      data: chapter,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch SWAYAM-NPTEL local chapter details" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = updateSwayamChapter(body);
    return NextResponse.json({
      success: true,
      message: "SWAYAM local chapter updated successfully",
      data: updated,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update SWAYAM local chapter" },
      { status: 500 }
    );
  }
}
