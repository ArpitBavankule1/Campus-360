import { NextResponse } from "next/server";
import { MOCK_CONVOCATION_CEREMONY } from "@/lib/convocation/convocation-engine";
import { ConvocationCeremony } from "@/types";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_CONVOCATION_CEREMONY,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updatedCeremony: ConvocationCeremony = {
      ...MOCK_CONVOCATION_CEREMONY,
      ...body,
      id: body.id || `cer-${Date.now()}`,
    };

    return NextResponse.json({
      success: true,
      message: "Convocation ceremony schedule updated successfully",
      data: updatedCeremony,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update convocation ceremony" },
      { status: 400 }
    );
  }
}
