import { NextRequest, NextResponse } from "next/server";
import { MOCK_LIBRARY_BOOKS } from "@/lib/library/library-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { LibraryBook } from "@/types";

const activeBooks: LibraryBook[] = [...MOCK_LIBRARY_BOOKS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const category = searchParams.get("category");
    const availableOnly = searchParams.get("available_only") === "true";
    const digitalOnly = searchParams.get("digital_only") === "true";

    // Anti-injection defenses
    if (
      (q && (containsSQLInjection(q) || containsXSS(q))) ||
      (category && (containsSQLInjection(category) || containsXSS(category)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid search query parameter." },
        { status: 400 }
      );
    }

    let results = [...activeBooks];

    if (category && category !== "all") {
      const sanitizedCategory = sanitizeInput(category).toLowerCase();
      results = results.filter((b) => b.category === sanitizedCategory);
    }

    if (availableOnly) {
      results = results.filter((b) => b.available_copies > 0);
    }

    if (digitalOnly) {
      results = results.filter((b) => b.is_digital_available);
    }

    if (q && q.trim()) {
      const sanitizedQ = sanitizeInput(q).toLowerCase();
      results = results.filter(
        (b) =>
          b.title.toLowerCase().includes(sanitizedQ) ||
          b.author.toLowerCase().includes(sanitizedQ) ||
          b.isbn.toLowerCase().includes(sanitizedQ) ||
          b.call_number.toLowerCase().includes(sanitizedQ) ||
          b.shelf_location.toLowerCase().includes(sanitizedQ)
      );
    }

    return NextResponse.json({
      success: true,
      data: results,
      totalCount: results.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Library books query error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error fetching library catalog." },
      { status: 500 }
    );
  }
}
