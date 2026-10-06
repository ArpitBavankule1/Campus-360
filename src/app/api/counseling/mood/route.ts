import { NextResponse } from "next/server";
import { MOCK_MOOD_CHECKINS } from "@/lib/counseling/counseling-engine";
import { MoodCheckin } from "@/types";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_MOOD_CHECKINS,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newCheckin: MoodCheckin = {
      id: `mc-${Date.now()}`,
      college_id: body.college_id || "c0000000-0000-0000-0000-000000000001",
      scholar_id: body.scholar_id || "SCH-CS-2023-019",
      mood_score: Number(body.mood_score || 4),
      mood_tag: body.mood_tag || "Calm",
      sleep_hours: Number(body.sleep_hours || 7.0),
      stress_factors: Array.isArray(body.stress_factors) ? body.stress_factors : ["Academics"],
      coping_exercise: body.coping_exercise || "5-minute mindfulness breathing exercise",
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Daily mood check-in recorded. Tailored wellness micro-exercise generated.",
      data: newCheckin,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to record mood check-in" },
      { status: 400 }
    );
  }
}
