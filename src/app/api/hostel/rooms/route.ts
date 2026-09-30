import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_HOSTEL_BLOCKS,
  MOCK_HOSTEL_ROOMS,
} from "@/lib/hostel/hostel-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const blockId = searchParams.get("block_id");
    const gender = searchParams.get("gender");
    const roomType = searchParams.get("room_type");
    const acOnly = searchParams.get("ac_only") === "true";

    // Anti-injection defenses
    if (
      (q && (containsSQLInjection(q) || containsXSS(q))) ||
      (blockId && (containsSQLInjection(blockId) || containsXSS(blockId))) ||
      (gender && (containsSQLInjection(gender) || containsXSS(gender))) ||
      (roomType && (containsSQLInjection(roomType) || containsXSS(roomType)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid search query parameter or malicious input detected." },
        { status: 400 }
      );
    }

    let results = MOCK_HOSTEL_ROOMS.map((r) => ({
      ...r,
      block: MOCK_HOSTEL_BLOCKS.find((b) => b.id === r.block_id),
    }));

    if (blockId && blockId !== "all") {
      const sanitizedBlock = sanitizeInput(blockId);
      results = results.filter((r) => r.block_id === sanitizedBlock);
    }

    if (gender && gender !== "all") {
      const sanitizedGender = sanitizeInput(gender).toLowerCase();
      results = results.filter((r) => r.block?.gender === sanitizedGender);
    }

    if (roomType && roomType !== "all") {
      const sanitizedType = sanitizeInput(roomType).toLowerCase();
      results = results.filter((r) => r.room_type === sanitizedType);
    }

    if (acOnly) {
      results = results.filter((r) => r.ac_enabled);
    }

    if (q && q.trim()) {
      const sanitizedQ = sanitizeInput(q).toLowerCase();
      results = results.filter(
        (r) =>
          r.room_number.toLowerCase().includes(sanitizedQ) ||
          r.block?.name.toLowerCase().includes(sanitizedQ) ||
          r.block?.warden_name.toLowerCase().includes(sanitizedQ)
      );
    }

    return NextResponse.json({
      success: true,
      data: results,
      blocks: MOCK_HOSTEL_BLOCKS,
      total: results.length,
    });
  } catch (error) {
    console.error("Hostel rooms query error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve hostel rooms directory." },
      { status: 500 }
    );
  }
}
