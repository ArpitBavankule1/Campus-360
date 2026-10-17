import { NextRequest, NextResponse } from "next/server";
import { aicteComplianceStore } from "@/lib/aicte/aicte-engine";

export async function GET() {
  try {
    const data = aicteComplianceStore.getCommittees();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch AICTE statutory committees" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, last_meeting_date } = body;
    if (!id || !last_meeting_date) {
      return NextResponse.json(
        { success: false, error: "Missing required fields id and last_meeting_date" },
        { status: 400 }
      );
    }
    const updated = aicteComplianceStore.updateCommitteeMeeting(id, last_meeting_date);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Statutory committee not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update statutory committee meeting" },
      { status: 500 }
    );
  }
}
