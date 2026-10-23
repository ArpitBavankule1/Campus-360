import { NextRequest, NextResponse } from "next/server";
import {
  getPmUshaProposals,
  addPmUshaProposal,
  updatePmUshaProposal,
} from "@/lib/pm-usha/pm-usha-engine";

export async function GET() {
  try {
    const proposals = getPmUshaProposals();
    return NextResponse.json({
      success: true,
      data: proposals,
      count: proposals.length,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch PM-USHA project proposals" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.component_type || !body.estimated_budget_lakhs) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, component_type, estimated_budget_lakhs" },
        { status: 400 }
      );
    }
    const newProposal = addPmUshaProposal(body);
    return NextResponse.json(
      {
        success: true,
        message: "PM-USHA project proposal created successfully",
        data: newProposal,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create PM-USHA proposal" },
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
        { success: false, error: "Proposal ID is required for update" },
        { status: 400 }
      );
    }
    const updated = updatePmUshaProposal(id, patch);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Proposal not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "PM-USHA proposal updated successfully",
      data: updated,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update PM-USHA proposal" },
      { status: 500 }
    );
  }
}
