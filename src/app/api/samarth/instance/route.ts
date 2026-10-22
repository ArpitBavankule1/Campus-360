import { NextRequest, NextResponse } from "next/server";
import { getSamarthInstance, updateSamarthInstance } from "@/lib/samarth/samarth-engine";

export async function GET() {
  try {
    const instance = getSamarthInstance();
    return NextResponse.json({
      success: true,
      data: instance,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch SAMARTH institutional instance details" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = updateSamarthInstance(body);
    return NextResponse.json({
      success: true,
      message: "SAMARTH institutional instance updated successfully",
      data: updated,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update SAMARTH instance details" },
      { status: 500 }
    );
  }
}
