import { NextRequest, NextResponse } from "next/server";
import {
  getIicQuarterlyActivities,
  submitIicActivity,
  updateActivityStatus,
} from "@/lib/iic/iic-engine";
import { IicQuarter, IicActivityCategory, IicActivityStatus } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const quarter = searchParams.get("quarter") as IicQuarter | null;
    const category = searchParams.get("category") as IicActivityCategory | null;

    let activities = getIicQuarterlyActivities();

    if (quarter) {
      activities = activities.filter((a) => a.quarter === quarter);
    }
    if (category) {
      activities = activities.filter((a) => a.category === category);
    }

    return NextResponse.json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch IIC quarterly activities" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.category || !body.quarter || !body.coordinator_name) {
      return NextResponse.json(
        { success: false, error: "Missing required activity fields" },
        { status: 400 }
      );
    }

    const newActivity = submitIicActivity({
      title: body.title,
      category: body.category,
      quarter: body.quarter,
      coordinator_name: body.coordinator_name,
      start_date: body.start_date || new Date().toISOString().split("T")[0],
      end_date: body.end_date || new Date().toISOString().split("T")[0],
      participant_count: Number(body.participant_count) || 100,
      faculty_participant_count: Number(body.faculty_participant_count) || 12,
      expenditure_inr: Number(body.expenditure_inr) || 30000,
      mic_reward_points: Number(body.mic_reward_points) || 20,
    });

    return NextResponse.json(
      {
        success: true,
        message: "IIC Activity logged and submitted to MoE Innovation Cell",
        data: newActivity,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to submit IIC activity" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Missing id or status in request body" },
        { status: 400 }
      );
    }

    const updated = updateActivityStatus(id, status as IicActivityStatus);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Activity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Activity status updated successfully",
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update activity status" },
      { status: 500 }
    );
  }
}
