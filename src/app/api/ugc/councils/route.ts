import { NextRequest, NextResponse } from "next/server";
import { ugcAutonomousStore } from "@/lib/ugc/ugc-engine";

export async function GET() {
  try {
    const data = ugcAutonomousStore.getCouncils();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch UGC statutory councils" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = ugcAutonomousStore.scheduleCouncilMeeting(body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Council not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to schedule council meeting" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = ugcAutonomousStore.updateCouncilCompliance(body.id, body.status);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Council not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update council compliance" },
      { status: 500 }
    );
  }
}
