import { NextRequest, NextResponse } from "next/server";
import {
  getPmUshaMilestones,
  addPmUshaMilestone,
  updatePmUshaMilestone,
} from "@/lib/pm-usha/pm-usha-engine";

export async function GET() {
  try {
    const milestones = getPmUshaMilestones();
    return NextResponse.json({
      success: true,
      data: milestones,
      count: milestones.length,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch PM-USHA physical milestones" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.milestone_name || !body.work_category || !body.target_date) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: milestone_name, work_category, target_date" },
        { status: 400 }
      );
    }
    const newMilestone = addPmUshaMilestone(body);
    return NextResponse.json(
      {
        success: true,
        message: "PM-USHA physical milestone registered successfully",
        data: newMilestone,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to register physical milestone" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...patch } = body;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Milestone ID is required for update" },
        { status: 400 }
      );
    }
    const updated = updatePmUshaMilestone(id, patch);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Milestone not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "PM-USHA physical milestone updated successfully",
      data: updated,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update milestone" },
      { status: 500 }
    );
  }
}
