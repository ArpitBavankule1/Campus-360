import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_LIBRARY_BOOKS,
  MOCK_STUDENT_RESERVATIONS,
  generateReservationCode,
} from "@/lib/library/library-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { LibraryReservation, LibraryBook } from "@/types";

const activeBooks: LibraryBook[] = [...MOCK_LIBRARY_BOOKS];
const activeReservations: LibraryReservation[] = [...MOCK_STUDENT_RESERVATIONS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("student_id") || "student-uuid-alex";

    if (containsSQLInjection(studentId)) {
      return NextResponse.json(
        { success: false, error: "Invalid student identifier." },
        { status: 400 }
      );
    }

    const records = activeReservations
      .filter((r) => r.student_id === studentId)
      .map((r) => {
        if (!r.book) {
          const bk = activeBooks.find((b) => b.id === r.book_id);
          return { ...r, book: bk };
        }
        return r;
      });

    return NextResponse.json({
      success: true,
      data: records,
      totalCount: records.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Library reserve GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch student library reservations." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookId, studentId = "student-uuid-alex" } = body;

    if (!bookId) {
      return NextResponse.json(
        { success: false, error: "Book ID is required to place a reservation hold." },
        { status: 400 }
      );
    }

    if (containsSQLInjection(bookId) || containsSQLInjection(studentId) || containsXSS(bookId)) {
      return NextResponse.json(
        { success: false, error: "Security validation error in input parameters." },
        { status: 400 }
      );
    }

    const book = activeBooks.find((b) => b.id === bookId);
    if (!book) {
      return NextResponse.json(
        { success: false, error: "Book not found in library inventory." },
        { status: 404 }
      );
    }

    // Check if student already has an active hold on this title
    const existingHold = activeReservations.find(
      (r) =>
        r.book_id === bookId &&
        r.student_id === studentId &&
        (r.status === "queued" || r.status === "ready_for_pickup")
    );
    if (existingHold) {
      return NextResponse.json(
        {
          success: false,
          error: "You already have an active reservation hold placed on this title.",
        },
        { status: 400 }
      );
    }

    // Reservations hold expires in 7 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const reservationCode = generateReservationCode();

    const newReservation: LibraryReservation = {
      id: `res-${crypto.randomUUID()}`,
      college_id: book.college_id,
      book_id: book.id,
      student_id: sanitizeInput(studentId),
      reservation_code: reservationCode,
      status: book.available_copies > 0 ? "ready_for_pickup" : "queued",
      reserved_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      book,
    };

    activeReservations.unshift(newReservation);

    return NextResponse.json({
      success: true,
      message: `Reservation hold placed for "${book.title}". Hold Code: ${reservationCode}.`,
      data: newReservation,
    });
  } catch (error) {
    console.error("Library reserve POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to place reservation hold." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const reservationId = searchParams.get("id");

    if (!reservationId || containsSQLInjection(reservationId) || containsXSS(reservationId)) {
      return NextResponse.json(
        { success: false, error: "Valid reservation ID is required for cancellation." },
        { status: 400 }
      );
    }

    const reservation = activeReservations.find((r) => r.id === reservationId);
    if (!reservation) {
      return NextResponse.json(
        { success: false, error: "Reservation hold not found." },
        { status: 404 }
      );
    }

    reservation.status = "cancelled";

    return NextResponse.json({
      success: true,
      message: "Reservation hold successfully cancelled.",
      data: reservation,
    });
  } catch (error) {
    console.error("Library reserve DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to cancel reservation hold." },
      { status: 500 }
    );
  }
}
