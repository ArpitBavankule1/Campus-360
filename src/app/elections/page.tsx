"use client";

import React, { useState } from "react";
import {
  Vote,
  Users,
  CheckCircle2,
  Trophy,
  Filter,
  Flame,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import {
  MOCK_STUDENT_ELECTION,
  MOCK_ELECTION_CANDIDATES,
  MOCK_ELECTION_RESULTS,
  calculateElectionsOverview,
} from "@/lib/elections/elections-engine";
import { ElectionCandidate, BallotVote, ElectionPost } from "@/types";
import { CandidateManifestoCard } from "@/components/elections/candidate-manifesto-card";
import { ElectionResultCard } from "@/components/elections/election-result-card";
import { CastBallotModal } from "@/components/elections/cast-ballot-modal";
import { NominateCandidateModal } from "@/components/elections/nominate-candidate-modal";

export default function ElectionsPortalPage() {
  const [election] = useState(MOCK_STUDENT_ELECTION);
  const [candidates, setCandidates] = useState<ElectionCandidate[]>(MOCK_ELECTION_CANDIDATES);
  const [results] = useState(MOCK_ELECTION_RESULTS);
  const [selectedPost, setSelectedPost] = useState<string>("All");

  const [selectedCandidate, setSelectedCandidate] = useState<ElectionCandidate | null>(null);
  const [isVoteOpen, setIsVoteOpen] = useState(false);
  const [isNominateOpen, setIsNominateOpen] = useState(false);

  const stats = calculateElectionsOverview(election, candidates, results);

  const filteredCandidates = candidates.filter((c) => {
    return selectedPost === "All" || c.post_contested === selectedPost;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold mb-2">
            <Vote className="w-3.5 h-3.5" />
            Phase 39 • Student Elections, E-Voting & Campus Democracy Portal
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Gymkhana Student Council Elections
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Cryptographic zero-knowledge verifiable voting, candidate manifesto showcases, and live voter turnout telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNominateOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-violet-400" />
            File Candidacy
          </button>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold animate-pulse">
            <Flame className="w-4 h-4" />
            E-Voting Polls Open
          </div>
        </div>
      </div>

      {/* Telemetry Stats Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
            <Users className="w-4 h-4 text-violet-400" />
            Eligible Student Electorate
          </div>
          <div className="text-2xl font-bold text-white">
            {stats.totalEligibleVoters.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Biometrically verified voters
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
            <Vote className="w-4 h-4 text-emerald-400" />
            Total Ballots Cast
          </div>
          <div className="text-2xl font-bold text-emerald-300">
            {stats.totalVotesPolled.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Encrypted ZKP ballot receipts
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
            <Flame className="w-4 h-4 text-amber-400" />
            Voter Turnout Rate
          </div>
          <div className="text-2xl font-bold text-amber-300">
            {stats.voterTurnoutPercentage}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across 8 campus faculties
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Vetted Candidates
          </div>
          <div className="text-2xl font-bold text-cyan-300">
            {stats.approvedCandidatesCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Scrutinized by Election Commission
          </div>
        </div>
      </div>

      {/* Certified Results Section (if available) */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Certified Mandates & Declared Outcomes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((res) => (
              <ElectionResultCard key={res.id} result={res} />
            ))}
          </div>
        </div>
      )}

      {/* Candidates & Voting Directory */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              Official Candidate Manifestos & E-Ballot Booth
            </h2>
            <p className="text-xs text-slate-400">
              Review candidates' vision statements, core initiatives, and cast your blinded vote.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500 ml-2" />
            {["All", "President", "General Secretary Technical", "General Secretary Cultural"].map((post) => (
              <button
                key={post}
                onClick={() => setSelectedPost(post)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedPost === post
                    ? "bg-violet-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {post === "General Secretary Technical" ? "Tech" : post === "General Secretary Cultural" ? "Cultural" : post}
              </button>
            ))}
          </div>
        </div>

        {/* Candidate Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCandidates.map((candidate) => (
            <CandidateManifestoCard
              key={candidate.id}
              candidate={candidate}
              onVoteClick={(cand) => {
                setSelectedCandidate(cand);
                setIsVoteOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      <CastBallotModal
        isOpen={isVoteOpen}
        onClose={() => {
          setIsVoteOpen(false);
          setSelectedCandidate(null);
        }}
        candidate={selectedCandidate}
        onSuccess={(newBallot) => {
          setCandidates((prev) =>
            prev.map((c) =>
              c.id === newBallot.candidate_id
                ? { ...c, vote_count: c.vote_count + 1 }
                : c
            )
          );
        }}
      />

      <NominateCandidateModal
        isOpen={isNominateOpen}
        onClose={() => setIsNominateOpen(false)}
        onSuccess={(newCand) => {
          setCandidates((prev) => [newCand, ...prev]);
        }}
      />
    </div>
  );
}
