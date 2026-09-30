import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_CLUB_TICKETS,
  generateClubTicketCode,
} from "@/lib/clubs/clubs-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { ClubEventTicket } from "@/types";

const activeTickets: ClubEventTicket[] = [...MOCK_CLUB_TICKETS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("student_id");

    let results = [...activeTickets];
    if (studentId) {
      const sanitizedStudent = sanitizeInput(studentId);
      results = results.filter((t) => t.student_id === sanitizedStudent);
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error("Club event tickets fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve club event passes." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventId, eventTitle, venue, seatTier, studentId, price } = body;

    if (!eventId || !eventTitle) {
      return NextResponse.json(
        { success: false, error: "Event ID and Title are required." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(eventTitle) ||
      containsXSS(eventTitle) ||
      (venue && (containsSQLInjection(venue) || containsXSS(venue)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid characters in ticketing payload." },
        { status: 400 }
      );
    }

    const newTicket: ClubEventTicket = {
      id: `tkt-${Date.now()}`,
      college_id: "col-apex-001",
      event_id: sanitizeInput(eventId),
      student_id: studentId || "00000000-0000-0000-0000-000000000001",
      ticket_code: generateClubTicketCode(),
      event_title: sanitizeInput(eventTitle),
      venue: venue ? sanitizeInput(venue) : "Main Campus Auditorium",
      seat_tier: seatTier ? sanitizeInput(seatTier) : "General Access",
      price: Number(price) || 0.0,
      is_verified: true,
      checked_in_at: null,
      created_at: new Date().toISOString(),
    };

    activeTickets.unshift(newTicket);

    return NextResponse.json({
      success: true,
      data: newTicket,
      message: `Event entry pass confirmed: ${newTicket.ticket_code}`,
    });
  } catch (error) {
    console.error("Event pass reservation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reserve event entry pass." },
      { status: 500 }
    );
  }
}
