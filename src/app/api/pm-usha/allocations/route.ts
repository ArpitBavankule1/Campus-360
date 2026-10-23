import { NextRequest, NextResponse } from "next/server";
import {
  getPmUshaFundAllocations,
  addPmUshaFundAllocation,
  updatePmUshaFundAllocation,
} from "@/lib/pm-usha/pm-usha-engine";

export async function GET() {
  try {
    const allocations = getPmUshaFundAllocations();
    return NextResponse.json({
      success: true,
      data: allocations,
      count: allocations.length,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch PM-USHA fund allocations" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.sanction_order_no || !body.total_sanctioned_lakhs) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: sanction_order_no, total_sanctioned_lakhs" },
        { status: 400 }
      );
    }
    const newAllocation = addPmUshaFundAllocation(body);
    return NextResponse.json(
      {
        success: true,
        message: "PM-USHA fund allocation registered successfully",
        data: newAllocation,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to register PM-USHA fund allocation" },
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
        { success: false, error: "Allocation ID is required for update" },
        { status: 400 }
      );
    }
    const updated = updatePmUshaFundAllocation(id, patch);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Fund allocation not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "PM-USHA fund allocation updated successfully",
      data: updated,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update fund allocation" },
      { status: 500 }
    );
  }
}
