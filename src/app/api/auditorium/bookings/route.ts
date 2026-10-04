import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_AUDITORIUM_RESERVATIONS,
  generateAuditoriumBookingCode,
} from "@/lib/auditorium/auditorium-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { AuditoriumReservation } from "@/types";

const activeReservations: AuditoriumReservation[] = [
  ...MOCK_AUDITORIUM_RESERVATIONS,
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bookingCode = searchParams.get("bookingCode");
    const status = searchParams.get("status");

    if (
      (bookingCode && (containsSQLInjection(bookingCode) || containsXSS(bookingCode))) ||
      (status && (containsSQLInjection(status) || containsXSS(status)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid booking query parameters." },
        { status: 400 }
      );
    }

    let results = [...activeReservations];

    if (bookingCode) {
      const sanitizedCode = sanitizeInput(bookingCode).toUpperCase();
      results = results.filter((r) => r.booking_code === sanitizedCode);
    }

    if (status && status !== "all") {
      const sanitizedStatus = sanitizeInput(status).toLowerCase();
      results = results.filter(
        (r) => r.booking_status.toLowerCase() === sanitizedStatus
      );
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      hallName,
      eventTitle,
      organizerName,
      organizerRole,
      eventDate,
      startTime,
      endTime,
      expectedAttendees,
    } = body;

    if (!hallName || !eventTitle || !organizerName || !eventDate) {
      return NextResponse.json(
        { success: false, error: "Missing required reservation parameters." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(hallName) ||
      containsXSS(hallName) ||
      containsSQLInjection(eventTitle) ||
      containsXSS(eventTitle) ||
      containsSQLInjection(organizerName) ||
      containsXSS(organizerName)
    ) {
      return NextResponse.json(
        { success: false, error: "Security violation detected in reservation payload." },
        { status: 400 }
      );
    }

    const newBooking: AuditoriumReservation = {
      id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      booking_code: generateAuditoriumBookingCode(),
      hall_name: sanitizeInput(hallName),
      event_title: sanitizeInput(eventTitle),
      organizer_name: sanitizeInput(organizerName),
      organizer_role: organizerRole || "Student Club Lead",
      event_date: eventDate,
      start_time: startTime || "10:00:00",
      end_time: endTime || "14:00:00",
      expected_attendees: Number(expectedAttendees) || 300,
      booking_status: "Confirmed",
      created_at: new Date().toISOString(),
    };

    activeReservations.unshift(newBooking);

    return NextResponse.json({
      success: true,
      data: newBooking,
      message: "Auditorium reservation confirmed with cryptographic docket.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
