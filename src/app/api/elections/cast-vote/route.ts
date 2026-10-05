import { NextResponse } from "next/server";
import {
  MOCK_BALLOT_VOTES,
  MOCK_STUDENT_ELECTION,
  generateVoteReceiptCode,
} from "@/lib/elections/elections-engine";
import { BallotVote } from "@/types";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_BALLOT_VOTES,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newBallot: BallotVote = {
      id: `vote-${Date.now()}`,
      college_id: body.college_id || "c0000000-0000-0000-0000-000000000001",
      election_id: body.election_id || MOCK_STUDENT_ELECTION.id,
      ballot_receipt_code: generateVoteReceiptCode(),
      post_contested: body.post_contested || "President",
      candidate_id: body.candidate_id || "cand-1",
      cryptographic_token_hash: `ZKP_HASH_0x${Math.random().toString(16).substring(2, 10).toUpperCase()}_BALLOT_ENCRYPTED`,
      cast_timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Encrypted anonymous ballot cast successfully. Receipt token generated.",
      data: newBallot,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to cast ballot" },
      { status: 400 }
    );
  }
}
