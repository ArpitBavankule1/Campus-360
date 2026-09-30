import { NextRequest, NextResponse } from "next/server";
import { MOCK_CLUBS, MOCK_MEMBERSHIPS } from "@/lib/clubs/clubs-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { ClubCategory, ClubMembership, StudentClub } from "@/types";

const activeClubs: StudentClub[] = [...MOCK_CLUBS];
const activeMemberships: ClubMembership[] = [...MOCK_MEMBERSHIPS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const q = searchParams.get("q");

    if (
      (category && (containsSQLInjection(category) || containsXSS(category))) ||
      (q && (containsSQLInjection(q) || containsXSS(q)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid clubs query parameter." },
        { status: 400 }
      );
    }

    let results = [...activeClubs];

    if (category && category !== "all") {
      const sanitizedCat = sanitizeInput(category).toLowerCase() as ClubCategory;
      results = results.filter((c) => c.category === sanitizedCat);
    }

    if (q && q.trim()) {
      const sanitizedQ = sanitizeInput(q).toLowerCase();
      results = results.filter(
        (c) =>
          c.name.toLowerCase().includes(sanitizedQ) ||
          c.description.toLowerCase().includes(sanitizedQ) ||
          c.lead_student_name.toLowerCase().includes(sanitizedQ) ||
          c.faculty_mentor_name.toLowerCase().includes(sanitizedQ)
      );
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error("Clubs directory query error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve student clubs." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clubId, studentId, role } = body;

    if (!clubId) {
      return NextResponse.json(
        { success: false, error: "Club ID is required." },
        { status: 400 }
      );
    }

    const club = activeClubs.find((c) => c.id === clubId || c.slug === clubId);
    if (!club) {
      return NextResponse.json(
        { success: false, error: "Club not found." },
        { status: 404 }
      );
    }

    const newMembership: ClubMembership = {
      id: `cm-${Date.now()}`,
      college_id: "col-apex-001",
      club_id: club.id,
      student_id: studentId || "00000000-0000-0000-0000-000000000001",
      role: role || "member",
      joined_at: new Date().toISOString(),
      status: "active",
      club,
    };

    activeMemberships.push(newMembership);
    club.member_count += 1;

    return NextResponse.json({
      success: true,
      data: newMembership,
      message: `Successfully joined ${club.name}!`,
    });
  } catch (error) {
    console.error("Club membership application error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to apply for club membership." },
      { status: 500 }
    );
  }
}
