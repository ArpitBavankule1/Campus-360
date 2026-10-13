import { NextRequest, NextResponse } from "next/server";
import { getNirfParameters } from "@/lib/nirf/nirf-engine";

export async function GET() {
  try {
    const parameters = getNirfParameters();
    return NextResponse.json({
      success: true,
      data: parameters,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch NIRF parameters" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, current_score } = body;

    if (!code || current_score === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing parameter code or current_score" },
        { status: 400 }
      );
    }

    const parameters = getNirfParameters();
    const target = parameters.find((p) => p.code === code);
    if (!target) {
      return NextResponse.json(
        { success: false, error: "Parameter not found" },
        { status: 404 }
      );
    }

    target.current_score = Number(current_score);
    return NextResponse.json({
      success: true,
      data: target,
      message: `Updated score for parameter ${code}`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update NIRF parameter" },
      { status: 500 }
    );
  }
}
