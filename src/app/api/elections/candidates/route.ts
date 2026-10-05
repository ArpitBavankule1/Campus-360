import { NextResponse } from "next/server";
import { MOCK_ELECTION_CANDIDATES } from "@/lib/elections/elections-engine";
import { ElectionCandidate } from "@/types";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_ELECTION_CANDIDATES,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newCandidate: ElectionCandidate = {
      id: `cand-${Date.now()}`,
      college_id: body.college_id || "c0000000-0000-0000-0000-000000000001",
      election_id: body.election_id || "elec-2026",
      candidate_name: body.candidate_name || "New Candidate",
      scholar_id: body.scholar_id || "SCH-CS-2023-088",
      department: body.department || "Computer Science & Engineering",
      year_of_study: Number(body.year_of_study || 3),
      post_contested: body.post_contested || "President",
      manifesto_slogan: body.manifesto_slogan || "Empowering the Student Body",
      key_initiatives: body.key_initiatives || ["Transparent Governance", "Campus Facilities"],
      campaign_tagline: body.campaign_tagline || "Vote for Innovation and Equality",
      approval_status: "Approved & Vetted",
      vote_count: 0,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Candidate nomination submitted and vetted successfully",
      data: newCandidate,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to submit nomination" },
      { status: 400 }
    );
  }
}
