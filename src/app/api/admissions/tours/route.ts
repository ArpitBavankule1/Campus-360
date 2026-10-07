import { NextResponse } from "next/server";
import {
  MOCK_TOUR_BOOKINGS,
  generateTourBookingCode,
} from "@/lib/admissions/admissions-engine";
import { CampusTourBooking } from "@/types";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_TOUR_BOOKINGS,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newTour: CampusTourBooking = {
      id: `tour-${Date.now()}`,
      college_id: body.college_id || "c0000000-0000-0000-0000-000000000001",
      booking_code: generateTourBookingCode(),
      candidate_name: body.candidate_name || "Prospective Scholar & Family",
      email: body.email || "visitor@example.com",
      phone: body.phone || "+91 98000 00000",
      preferred_date: body.preferred_date || "2026-10-25",
      time_slot: body.time_slot || "11:00 AM - 12:30 PM",
      tour_mode: body.tour_mode || "In-Person Welcome Center",
      assigned_counselor: body.assigned_counselor || "Prof. Sudhir Rao (Dean Admissions)",
      guests_count: Number(body.guests_count) || 2,
      status: "confirmed",
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Campus visit and admission counselor appointment confirmed.",
      data: newTour,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to schedule campus tour" },
      { status: 400 }
    );
  }
}
