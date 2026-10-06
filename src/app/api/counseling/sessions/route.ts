import { NextResponse } from "next/server";
import {
  MOCK_COUNSELING_SESSIONS,
  generateSessionCode,
  generateCounselingPassToken,
} from "@/lib/counseling/counseling-engine";
import { CounselingSession } from "@/types";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_COUNSELING_SESSIONS,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newSession: CounselingSession = {
      id: `cs-${Date.now()}`,
      college_id: body.college_id || "c0000000-0000-0000-0000-000000000001",
      session_code: generateSessionCode(),
      scholar_id: body.scholar_id || "SCH-CS-2023-019",
      scholar_name: body.scholar_name || "Aarav Sharma",
      counselor_name: body.counselor_name || "Dr. Ananya Sen, Ph.D.",
      counselor_specialization: body.counselor_specialization || "Clinical Psychologist & CBT",
      session_type: body.session_type || "One-on-One Tele-Therapy",
      scheduled_date: body.scheduled_date || "2026-10-15",
      scheduled_time_slot: body.scheduled_time_slot || "15:00 - 16:00",
      mode: body.mode || "Confidential Video Call",
      status: "Confirmed",
      confidential_notes_encrypted: true,
      access_pass_token: generateCounselingPassToken(),
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Counseling appointment confirmed. Encrypted access pass voucher generated.",
      data: newSession,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to schedule counseling session" },
      { status: 400 }
    );
  }
}
