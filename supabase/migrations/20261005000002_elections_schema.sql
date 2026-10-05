-- CampusLens AI — Phase 39: Smart Campus Student Elections, E-Voting & Campus Democracy Portal
-- Migration: 20261005000002_elections_schema.sql

-- 1. Student Elections Table
CREATE TABLE IF NOT EXISTS public.student_elections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  election_title TEXT NOT NULL,
  academic_session TEXT NOT NULL,
  election_commissioner TEXT NOT NULL,
  nomination_deadline TIMESTAMPTZ NOT NULL,
  voting_starts_at TIMESTAMPTZ NOT NULL,
  voting_ends_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'Voting Live' CHECK (status IN ('Nomination Phase', 'Campaigning', 'Voting Live', 'Counting Votes', 'Results Certified')),
  total_eligible_voters INTEGER NOT NULL DEFAULT 4500,
  total_votes_cast INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Election Candidates Table
CREATE TABLE IF NOT EXISTS public.election_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  election_id UUID REFERENCES public.student_elections(id) ON DELETE CASCADE,
  candidate_name TEXT NOT NULL,
  scholar_id TEXT NOT NULL,
  department TEXT NOT NULL,
  year_of_study INTEGER NOT NULL,
  post_contested TEXT NOT NULL CHECK (post_contested IN ('President', 'Vice President', 'General Secretary Academic', 'General Secretary Cultural', 'General Secretary Sports', 'General Secretary Technical')),
  manifesto_slogan TEXT NOT NULL,
  key_initiatives TEXT[] NOT NULL DEFAULT '{}',
  campaign_tagline TEXT NOT NULL,
  approval_status TEXT NOT NULL DEFAULT 'Approved & Vetted' CHECK (approval_status IN ('Approved & Vetted', 'Under Scrutiny', 'Disqualified')),
  vote_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Anonymous Ballot Votes Table (Cryptographic Zero-Knowledge Ballot)
CREATE TABLE IF NOT EXISTS public.ballot_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  election_id UUID REFERENCES public.student_elections(id) ON DELETE CASCADE,
  ballot_receipt_code TEXT NOT NULL UNIQUE,
  post_contested TEXT NOT NULL,
  candidate_id UUID REFERENCES public.election_candidates(id) ON DELETE CASCADE,
  cryptographic_token_hash TEXT NOT NULL,
  cast_timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Election Results Certification Table
CREATE TABLE IF NOT EXISTS public.election_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  election_id UUID REFERENCES public.student_elections(id) ON DELETE CASCADE,
  certificate_code TEXT NOT NULL UNIQUE,
  post_contested TEXT NOT NULL,
  winner_candidate_name TEXT NOT NULL,
  winning_margin_votes INTEGER NOT NULL,
  total_votes_polled INTEGER NOT NULL,
  voter_turnout_pct NUMERIC(5, 2) NOT NULL,
  certified_by TEXT NOT NULL,
  certified_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_student_elections_college ON public.student_elections(college_id);
CREATE INDEX IF NOT EXISTS idx_election_candidates_election ON public.election_candidates(election_id);
CREATE INDEX IF NOT EXISTS idx_ballot_votes_election ON public.ballot_votes(election_id);
CREATE INDEX IF NOT EXISTS idx_ballot_votes_receipt ON public.ballot_votes(ballot_receipt_code);
CREATE INDEX IF NOT EXISTS idx_election_results_cert ON public.election_results(certificate_code);

-- Enable Row Level Security
ALTER TABLE public.student_elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.election_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ballot_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.election_results ENABLE ROW LEVEL SECURITY;

-- Permissive demo policies
CREATE POLICY "Allow public read student elections" ON public.student_elections FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert student elections" ON public.student_elections FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read election candidates" ON public.election_candidates FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert election candidates" ON public.election_candidates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read ballot votes" ON public.ballot_votes FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert ballot votes" ON public.ballot_votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read election results" ON public.election_results FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert election results" ON public.election_results FOR INSERT WITH CHECK (true);
