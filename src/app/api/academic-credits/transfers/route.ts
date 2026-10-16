import { NextRequest, NextResponse } from "next/server";
import { academicCreditsStore } from "@/lib/academic-credits/academic-credits-engine";

export async function GET() {
  try {
    const data = academicCreditsStore.getCreditTransfers();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch credit transfer applications" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newTransfer = academicCreditsStore.submitCreditTransfer(body);
    return NextResponse.json({ success: true, data: newTransfer }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to submit credit transfer application" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, score, remarks } = body;
    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields id and status" },
        { status: 400 }
      );
    }
    const updated = academicCreditsStore.updateTransferStatus(id, status, score, remarks);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Credit transfer record not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update credit transfer status" },
      { status: 500 }
    );
  }
}
