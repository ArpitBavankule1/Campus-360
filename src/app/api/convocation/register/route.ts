import { NextResponse } from "next/server";
import {
  MOCK_CONVOCATION_REGISTRATIONS,
  generateConvocationPassCode,
} from "@/lib/convocation/convocation-engine";
import { ConvocationRegistration } from "@/types";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_CONVOCATION_REGISTRATIONS,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newRegistration: ConvocationRegistration = {
      id: `reg-${Date.now()}`,
      college_id: body.college_id || "c0000000-0000-0000-0000-000000000001",
      registration_code: `REG-CONV-2026-${Math.floor(100 + Math.random() * 900)}`,
      scholar_id: body.scholar_id || "SCH-CS-2023-019",
      scholar_name: body.scholar_name || "Aarav Sharma",
      degree_awarded: body.degree_awarded || "B.Tech Computer Science & AI",
      gown_size: body.gown_size || "Large (L)",
      guest_pass_count: Number(body.guest_pass_count || 2),
      allocated_seat_number: `ROW-${String.fromCharCode(65 + Math.floor(Math.random() * 6))}-0${Math.floor(10 + Math.random() * 89)}`,
      admittance_pass_code: generateConvocationPassCode(),
      is_gown_collected: false,
      is_checked_in: false,
      registered_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Convocation attendance & regalia booked successfully",
      data: newRegistration,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to register for convocation" },
      { status: 400 }
    );
  }
}
