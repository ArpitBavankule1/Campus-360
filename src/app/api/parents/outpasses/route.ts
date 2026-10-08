import { NextResponse } from "next/server";
import {
  getGuardianOutpasses,
  approveGuardianOutpass,
  rejectGuardianOutpass,
} from "@/lib/parents/parents-engine";

export async function GET() {
  try {
    const outpasses = getGuardianOutpasses();
    return NextResponse.json({
      success: true,
      data: outpasses,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch guardian out-pass requests" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { outpassId, action, remarks } = body;

    if (!outpassId || !action) {
      return NextResponse.json(
        { success: false, error: "outpassId and action (approve/reject) are required." },
        { status: 400 }
      );
    }

    let updated;
    if (action === "approve") {
      updated = approveGuardianOutpass(outpassId, remarks || "Approved by Guardian");
    } else if (action === "reject") {
      updated = rejectGuardianOutpass(outpassId, remarks || "Declined by Guardian");
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid action. Must be 'approve' or 'reject'." },
        { status: 400 }
      );
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Out-pass request not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Out-pass request ${action}d successfully.`,
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process out-pass authorization" },
      { status: 500 }
    );
  }
}
