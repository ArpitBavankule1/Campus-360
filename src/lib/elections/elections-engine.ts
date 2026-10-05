// CampusLens AI — Phase 39: Smart Campus Student Elections & E-Voting Engine
// src/lib/elections/elections-engine.ts

import {
  StudentElection,
  ElectionCandidate,
  BallotVote,
  ElectionResultDocket,
  ElectionsOverviewStats,
} from "@/types";

export function generateVoteReceiptCode(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CL-VOTE-2026-${rand}`;
}

export function generateElectionCertCode(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CL-ELEC-CERT-2026-${rand}`;
}

export const MOCK_STUDENT_ELECTION: StudentElection = {
  id: "elec-2026",
  college_id: "c0000000-0000-0000-0000-000000000001",
  election_title: "Annual Gymkhana & Student Council General Elections 2026",
  academic_session: "2026-2027",
  election_commissioner: "Prof. (Dr.) Manisha Deshmukh (Chief Election Officer)",
  nomination_deadline: "2026-10-08T17:00:00Z",
  voting_starts_at: "2026-10-10T08:00:00Z",
  voting_ends_at: "2026-10-10T18:00:00Z",
  status: "Voting Live",
  total_eligible_voters: 4800,
  total_votes_cast: 3260,
  created_at: "2026-10-01T00:00:00Z",
};

export const MOCK_ELECTION_CANDIDATES: ElectionCandidate[] = [
  {
    id: "cand-1",
    college_id: "c0000000-0000-0000-0000-000000000001",
    election_id: "elec-2026",
    candidate_name: "Devrat Singhania",
    scholar_id: "SCH-CS-2023-014",
    department: "Computer Science & Engineering",
    year_of_study: 3,
    post_contested: "President",
    manifesto_slogan: "Transparent Governance, 24x7 Maker Hubs & Enhanced Placement Drives",
    key_initiatives: [
      "Open Student Council budget meetings with live community telemetry",
      "Hostel high-speed Wi-Fi upgrade to 10 Gbps fiber backbones",
      "Round-the-clock cafeteria night canteen subsidy",
    ],
    campaign_tagline: "Empowering Every Scholar's Voice",
    approval_status: "Approved & Vetted",
    vote_count: 1420,
    created_at: "2026-10-03T10:00:00Z",
  },
  {
    id: "cand-2",
    college_id: "c0000000-0000-0000-0000-000000000001",
    election_id: "elec-2026",
    candidate_name: "Ananya Deshpande",
    scholar_id: "SCH-EE-2023-052",
    department: "Electrical & Electronics Engineering",
    year_of_study: 3,
    post_contested: "President",
    manifesto_slogan: "Inclusive Campus, Women in STEM Fellowships & Green Microgrids",
    key_initiatives: [
      "Expanding institutional emergency mental wellness helplines",
      "Subsidized public transit EV passes for all day scholars",
      "Creation of an inter-disciplinary student research innovation grant",
    ],
    campaign_tagline: "Progressive, Equitable, Sustainable",
    approval_status: "Approved & Vetted",
    vote_count: 1280,
    created_at: "2026-10-03T11:00:00Z",
  },
  {
    id: "cand-3",
    college_id: "c0000000-0000-0000-0000-000000000001",
    election_id: "elec-2026",
    candidate_name: "Tanmay Bhatnagar",
    scholar_id: "SCH-ME-2023-033",
    department: "Mechanical & Automation Engineering",
    year_of_study: 3,
    post_contested: "General Secretary Technical",
    manifesto_slogan: "Fostering Student Hackathons, Robotics Arenas & Cloud Credits",
    key_initiatives: [
      "Institutional $5,000 GPU computing grants for ML research groups",
      "Annual Inter-Collegiate Apex TechFest with ₹25 Lakhs prize pool",
      "Free certification reimbursement for AWS, Google Cloud, and Azure",
    ],
    campaign_tagline: "Building the Future of Apex Engineering",
    approval_status: "Approved & Vetted",
    vote_count: 1890,
    created_at: "2026-10-04T09:00:00Z",
  },
  {
    id: "cand-4",
    college_id: "c0000000-0000-0000-0000-000000000001",
    election_id: "elec-2026",
    candidate_name: "Pooja Krishnan",
    scholar_id: "SCH-BT-2023-019",
    department: "Bioengineering & Biotechnology",
    year_of_study: 3,
    post_contested: "General Secretary Cultural",
    manifesto_slogan: "Vibrant Arts, Pro-Nites, National Drama Circuit & Open Amphitheater",
    key_initiatives: [
      "Re-launch of Nirvana Cultural Fest with international headliner bands",
      "Professional sound acoustics and lighting upgrade for the open amphitheater",
      "Weekly campus acoustic busking and open-mic coffeehouse evenings",
    ],
    campaign_tagline: "Igniting Culture, Passion & Artistry",
    approval_status: "Approved & Vetted",
    vote_count: 1650,
    created_at: "2026-10-04T10:30:00Z",
  },
];

export const MOCK_BALLOT_VOTES: BallotVote[] = [
  {
    id: "vote-1",
    college_id: "c0000000-0000-0000-0000-000000000001",
    election_id: "elec-2026",
    ballot_receipt_code: "CL-VOTE-2026-5812",
    post_contested: "President",
    candidate_id: "cand-1",
    cryptographic_token_hash: "ZKP_HASH_0x9B2A8C4D_BALLOT_ENCRYPTED",
    cast_timestamp: "2026-10-10T09:12:00Z",
  },
  {
    id: "vote-2",
    college_id: "c0000000-0000-0000-0000-000000000001",
    election_id: "elec-2026",
    ballot_receipt_code: "CL-VOTE-2026-9214",
    post_contested: "General Secretary Technical",
    candidate_id: "cand-3",
    cryptographic_token_hash: "ZKP_HASH_0x4F1E6D8A_BALLOT_ENCRYPTED",
    cast_timestamp: "2026-10-10T10:45:00Z",
  },
];

export const MOCK_ELECTION_RESULTS: ElectionResultDocket[] = [
  {
    id: "res-1",
    college_id: "c0000000-0000-0000-0000-000000000001",
    election_id: "elec-2026",
    certificate_code: "CL-ELEC-CERT-2026-001",
    post_contested: "General Secretary Technical",
    winner_candidate_name: "Tanmay Bhatnagar",
    winning_margin_votes: 610,
    total_votes_polled: 3260,
    voter_turnout_pct: 67.92,
    certified_by: "Prof. (Dr.) Manisha Deshmukh (Chief Election Officer)",
    certified_at: "2026-10-10T19:30:00Z",
  },
  {
    id: "res-2",
    college_id: "c0000000-0000-0000-0000-000000000001",
    election_id: "elec-2026",
    certificate_code: "CL-ELEC-CERT-2026-002",
    post_contested: "General Secretary Cultural",
    winner_candidate_name: "Pooja Krishnan",
    winning_margin_votes: 430,
    total_votes_polled: 3260,
    voter_turnout_pct: 67.92,
    certified_by: "Prof. (Dr.) Manisha Deshmukh (Chief Election Officer)",
    certified_at: "2026-10-10T19:30:00Z",
  },
];

export function calculateElectionsOverview(
  election: StudentElection = MOCK_STUDENT_ELECTION,
  candidates: ElectionCandidate[] = MOCK_ELECTION_CANDIDATES,
  results: ElectionResultDocket[] = MOCK_ELECTION_RESULTS
): ElectionsOverviewStats {
  const turnoutPct =
    election.total_eligible_voters > 0
      ? Number(
          ((election.total_votes_cast / election.total_eligible_voters) * 100).toFixed(2)
        )
      : 0;

  return {
    totalEligibleVoters: election.total_eligible_voters,
    totalVotesPolled: election.total_votes_cast,
    voterTurnoutPercentage: turnoutPct,
    approvedCandidatesCount: candidates.length,
    election,
    candidates,
    results,
  };
}
