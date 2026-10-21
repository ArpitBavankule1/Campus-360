import { NextRequest, NextResponse } from "next/server";
import {
  getSwayamCreditTransfers,
  submitSwayamCreditTransfer,
  approveSwayamCreditTransfer,
} from "@/lib/swayam/swayam-engine";

export async function GET() {
  try {
    const transfers = getSwayamCreditTransfers();
    return NextResponse.json({
      success: true,
      data: transfers,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch credit transfers" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = submitSwayamCreditTransfer(body);
    return NextResponse.json({
      success: true,
      message: "Academic credit transfer submitted to BoS / Academic Council",
      data: created,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to submit credit transfer" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    const updated = approveSwayamCreditTransfer(id, status);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Credit transfer not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Credit transfer ratified and synced with Academic Bank of Credits (ABC)",
      data: updated,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update credit transfer" },
      { status: 500 }
    );
  }
}
