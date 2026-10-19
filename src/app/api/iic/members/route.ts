import { NextResponse } from "next/server";
import { getIicCouncilMembers } from "@/lib/iic/iic-engine";

export async function GET() {
  try {
    const members = getIicCouncilMembers();
    return NextResponse.json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch IIC council members" },
      { status: 500 }
    );
  }
}
