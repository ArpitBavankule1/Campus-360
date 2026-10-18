import { NextResponse } from "next/server";
import { ugcAutonomousStore } from "@/lib/ugc/ugc-engine";

export async function GET() {
  try {
    const data = ugcAutonomousStore.getAutonomyReviews();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch UGC autonomy reviews" },
      { status: 500 }
    );
  }
}
