import { NextRequest, NextResponse } from "next/server";
import {
  getFellowshipTimesheets,
  submitFellowshipTimesheet,
  updateFellowshipTimesheetStatus,
} from "@/lib/fellowships/fellowships-engine";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get("application_id") || undefined;
    const timesheets = getFellowshipTimesheets(applicationId);

    return NextResponse.json({
      success: true,
      data: timesheets,
      count: timesheets.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch timesheets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      application_id,
      student_name,
      roll_number,
      week_start_date,
      week_end_date,
      hours_logged,
      duty_type,
      duty_summary,
    } = body;

    if (!application_id || !week_start_date || !week_end_date || !duty_summary) {
      return NextResponse.json(
        { success: false, error: "Missing required timesheet fields" },
        { status: 400 }
      );
    }

    const entry = submitFellowshipTimesheet({
      application_id,
      student_name: student_name || "Aarav Sharma",
      roll_number: roll_number || "2024BCSE042",
      week_start_date,
      week_end_date,
      hours_logged: Number(hours_logged) || 12,
      duty_type: duty_type || "laboratory_supervision",
      duty_summary,
    });

    return NextResponse.json({
      success: true,
      message: "Weekly timesheet duty logged successfully",
      data: entry,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to submit timesheet duty entry" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, supervisor_feedback } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Timesheet ID and target status required" },
        { status: 400 }
      );
    }

    const updated = updateFellowshipTimesheetStatus(id, status, supervisor_feedback);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Timesheet entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Timesheet status updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update timesheet status" },
      { status: 500 }
    );
  }
}
