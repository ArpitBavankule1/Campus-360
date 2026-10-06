import { NextResponse } from "next/server";
import { MOCK_PEER_CIRCLES } from "@/lib/counseling/counseling-engine";
import { PeerSupportCircle } from "@/types";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_PEER_CIRCLES,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newCircle: PeerSupportCircle = {
      id: `pc-${Date.now()}`,
      college_id: body.college_id || "c0000000-0000-0000-0000-000000000001",
      circle_name: body.circle_name || "Mindfulness & Resilience Fellowship",
      theme: body.theme || "Mindfulness & Sleep Hygiene",
      facilitator_name: body.facilitator_name || "Campus Wellness Peer Board",
      schedule_info: body.schedule_info || "Every Wednesday • 18:00 - 19:15 IST",
      meeting_venue: body.meeting_venue || "Student Wellness Common Studio",
      max_participants: Number(body.max_participants || 15),
      enrolled_count: 1,
      is_anonymous: body.is_anonymous !== false,
      status: "Open for Joining",
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Peer support circle initiated and open for anonymous participation.",
      data: newCircle,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create peer support circle" },
      { status: 400 }
    );
  }
}
