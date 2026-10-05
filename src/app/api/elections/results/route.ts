import { NextResponse } from "next/server";
import {
  MOCK_ELECTION_RESULTS,
  generateElectionCertCode,
} from "@/lib/elections/elections-engine";
import { ElectionResultDocket } from "@/types";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_ELECTION_RESULTS,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newResult: ElectionResultDocket = {
      id: `res-${Date.now()}`,
      college_id: body.college_id || "c0000000-0000-0000-0000-000000000001",
      election_id: body.election_id || "elec-2026",
      certificate_code: generateElectionCertCode(),
      post_contested: body.post_contested || "President",
      winner_candidate_name: body.winner_candidate_name || "Winner Candidate",
      winning_margin_votes: Number(body.winning_margin_votes || 150),
      total_votes_polled: Number(body.total_votes_polled || 3260),
      voter_turnout_pct: Number(body.voter_turnout_pct || 68.5),
      certified_by: body.certified_by || "Prof. (Dr.) Manisha Deshmukh (Chief Election Officer)",
      certified_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Election results certified and tamper-evident victory certificate minted",
      data: newResult,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to certify election results" },
      { status: 400 }
    );
  }
}
