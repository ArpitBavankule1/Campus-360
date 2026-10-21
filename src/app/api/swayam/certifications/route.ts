import { NextRequest, NextResponse } from "next/server";
import { getSwayamCertifications, issueSwayamCertification } from "@/lib/swayam/swayam-engine";

export async function GET() {
  try {
    const certs = getSwayamCertifications();
    return NextResponse.json({
      success: true,
      data: certs,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch SWAYAM certifications" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const issued = issueSwayamCertification(body);
    return NextResponse.json({
      success: true,
      message: "NPTEL proctored certification recorded and verified",
      data: issued,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to record certification" },
      { status: 500 }
    );
  }
}
