import { NextResponse } from "next/server";
import { getIicNispPolicies } from "@/lib/iic/iic-engine";

export async function GET() {
  try {
    const policies = getIicNispPolicies();
    return NextResponse.json({
      success: true,
      count: policies.length,
      data: policies,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch NISP policies" },
      { status: 500 }
    );
  }
}
