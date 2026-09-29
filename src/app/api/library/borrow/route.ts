import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_LIBRARY_BOOKS,
  MOCK_STUDENT_BORROW_RECORDS,
  MOCK_STUDENT_RESERVATIONS,
  generateBorrowPassCode,
  checkRenewalEligibility,
  calculateStudentLibrarySummary,
  DEFAULT_LOAN_DURATION_DAYS,
} from "@/lib/library/library-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { LibraryBorrowRecord, LibraryBook } from "@/types";

const activeBooks: LibraryBook[] = [...MOCK_LIBRARY_BOOKS];
const activeLoans: LibraryBorrowRecord[] = [...MOCK_STUDENT_BORROW_RECORDS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("student_id") || "student-uuid-alex";
    const status = searchParams.get("status");

    if (
      containsSQLInjection(studentId) ||
      (status && (containsSQLInjection(status) || containsXSS(status)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid parameter format detected." },
        { status: 400 }
      );
    }

    let records = activeLoans.filter((l) => l.student_id === studentId);
    if (status && status !== "all") {
      records = records.filter((l) => l.status === status);
    }

    // Attach book details if missing
    records = records.map((rec) => {
      if (!rec.book) {
        const bk = activeBooks.find((b) => b.id === rec.book_id);
        return { ...rec, book: bk };
      }
      return rec;
    });

    const summary = calculateStudentLibrarySummary(
      studentId,
      activeLoans,
      MOCK_STUDENT_RESERVATIONS
    );

    return NextResponse.json({
      success: true,
      data: records,
      summary,
      totalCount: records.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Library borrow query error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve student borrow ledger." },
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
        { success: false, error: "Book ID is required to initiate borrowing." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(bookId) ||
      containsSQLInjection(studentId) ||
      containsXSS(bookId)
    ) {
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

    if (book.available_copies <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "All physical copies of this title are currently loaned or reserved.",
        },
        { status: 400 }
      );
    }

    // Check maximum active loans limit (max 3 books per student)
    const currentActiveBorrows = activeLoans.filter(
      (r) => r.student_id === studentId && (r.status === "active" || r.status === "overdue")
    );
    if (currentActiveBorrows.length >= 3) {
      return NextResponse.json(
        {
          success: false,
          error: "Borrowing quota reached: Students may hold a maximum of 3 concurrent book loans.",
        },
        { status: 400 }
      );
    }

    // Check if student has overdue loans
    const hasOverdue = currentActiveBorrows.some((r) => r.status === "overdue");
    if (hasOverdue) {
      return NextResponse.json(
        {
          success: false,
          error: "Borrowing privilege suspended: You have overdue items and pending fines that must be resolved first.",
        },
        { status: 403 }
      );
    }

    const borrowedAt = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + DEFAULT_LOAN_DURATION_DAYS);

    const borrowPassCode = generateBorrowPassCode();

    const newLoan: LibraryBorrowRecord = {
      id: `brw-${crypto.randomUUID()}`,
      college_id: book.college_id,
      book_id: book.id,
      student_id: sanitizeInput(studentId),
      borrow_pass_code: borrowPassCode,
      borrowed_at: borrowedAt.toISOString(),
      due_date: dueDate.toISOString(),
      returned_at: null,
      renewal_count: 0,
      max_renewals: 2,
      fine_amount: 0.0,
      fine_paid: true,
      status: "active",
      book,
    };

    activeLoans.unshift(newLoan);
    book.available_copies = Math.max(0, book.available_copies - 1);

    return NextResponse.json({
      success: true,
      message: `Successfully checked out "${book.title}". Due on ${dueDate.toLocaleDateString("en-IN")}.`,
      data: newLoan,
    });
  } catch (error) {
    console.error("Borrow creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process book loan checkout." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { loanId } = body;

    if (!loanId || typeof loanId !== "string") {
      return NextResponse.json(
        { success: false, error: "Loan Record ID is required for renewal." },
        { status: 400 }
      );
    }

    if (containsSQLInjection(loanId) || containsXSS(loanId)) {
      return NextResponse.json(
        { success: false, error: "Invalid loan identifier." },
        { status: 400 }
      );
    }

    const loan = activeLoans.find((l) => l.id === loanId);
    if (!loan) {
      return NextResponse.json(
        { success: false, error: "Loan record not found." },
        { status: 404 }
      );
    }

    const eligibility = checkRenewalEligibility(loan);
    if (!eligibility.eligible) {
      return NextResponse.json(
        { success: false, error: eligibility.reason || "Loan is not eligible for renewal." },
        { status: 400 }
      );
    }

    // Extend due date by 14 days
    const currentDue = new Date(loan.due_date);
    currentDue.setDate(currentDue.getDate() + DEFAULT_LOAN_DURATION_DAYS);

    loan.due_date = currentDue.toISOString();
    loan.renewal_count += 1;
    loan.status = "active";
    loan.fine_amount = 0.0;
    loan.fine_paid = true;

    return NextResponse.json({
      success: true,
      message: `Loan renewed successfully! New due date is ${currentDue.toLocaleDateString("en-IN")}. (${loan.renewal_count}/${loan.max_renewals} renewals used).`,
      data: loan,
    });
  } catch (error) {
    console.error("Loan renewal error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process loan renewal." },
      { status: 500 }
    );
  }
}
