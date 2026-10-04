import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_EVENT_TICKETS,
  generateEventTicketCode,
} from "@/lib/auditorium/auditorium-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { EventTicket } from "@/types";

const activeTickets: EventTicket[] = [...MOCK_EVENT_TICKETS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ticketCode = searchParams.get("ticketCode");
    const q = searchParams.get("q");

    if (
      (ticketCode && (containsSQLInjection(ticketCode) || containsXSS(ticketCode))) ||
      (q && (containsSQLInjection(q) || containsXSS(q)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid ticket query parameters." },
        { status: 400 }
      );
    }

    let results = [...activeTickets];

    if (ticketCode) {
      const sanitizedCode = sanitizeInput(ticketCode).toUpperCase();
      results = results.filter((t) => t.ticket_code === sanitizedCode);
    }

    if (q && q.trim()) {
      const sanitizedQ = sanitizeInput(q).toLowerCase();
      results = results.filter(
        (t) =>
          t.attendee_name.toLowerCase().includes(sanitizedQ) ||
          t.event_title.toLowerCase().includes(sanitizedQ) ||
          t.hall_name.toLowerCase().includes(sanitizedQ)
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
    const { eventTitle, hallName, attendeeName, seatNumber, tier } = body;

    if (!eventTitle || !hallName || !attendeeName) {
      return NextResponse.json(
        { success: false, error: "Missing required ticket parameters." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(eventTitle) ||
      containsXSS(eventTitle) ||
      containsSQLInjection(hallName) ||
      containsXSS(hallName) ||
      containsSQLInjection(attendeeName) ||
      containsXSS(attendeeName)
    ) {
      return NextResponse.json(
        { success: false, error: "Security violation detected in ticket payload." },
        { status: 400 }
      );
    }

    const newTicket: EventTicket = {
      id: `tkt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      ticket_code: generateEventTicketCode(),
      event_title: sanitizeInput(eventTitle),
      hall_name: sanitizeInput(hallName),
      attendee_name: sanitizeInput(attendeeName),
      seat_number: seatNumber || "General Entry (Free Seating)",
      tier: tier || "Orchestra Premium",
      is_checked_in: false,
      issued_at: new Date().toISOString(),
    };

    activeTickets.unshift(newTicket);

    return NextResponse.json({
      success: true,
      data: newTicket,
      message: "Event admittance pass generated with cryptographic QR voucher.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
