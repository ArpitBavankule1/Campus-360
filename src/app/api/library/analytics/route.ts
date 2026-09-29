import { NextResponse } from "next/server";
import {
  MOCK_LIBRARY_BOOKS,
  MOCK_STUDENT_BORROW_RECORDS,
  MOCK_STUDENT_RESERVATIONS,
  MOCK_LIBRARY_E_RESOURCES,
  aggregateInstitutionalLibraryStats,
} from "@/lib/library/library-engine";

export async function GET() {
  try {
    const stats = aggregateInstitutionalLibraryStats(
      MOCK_LIBRARY_BOOKS,
      MOCK_STUDENT_BORROW_RECORDS,
      MOCK_STUDENT_RESERVATIONS,
      MOCK_LIBRARY_E_RESOURCES
    );

    return NextResponse.json({
      success: true,
      data: stats,
      eResources: MOCK_LIBRARY_E_RESOURCES,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Library analytics error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to compile institutional library analytics." },
      { status: 500 }
    );
  }
}
