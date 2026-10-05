"use client";

import React from "react";
import { ElectionCandidate } from "@/types";
import { Vote, CheckCircle2, User, Sparkles } from "lucide-react";

interface CandidateManifestoCardProps {
  candidate: ElectionCandidate;
  onVoteClick?: (candidate: ElectionCandidate) => void;
}

export function CandidateManifestoCard({
  candidate,
  onVoteClick,
}: CandidateManifestoCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-6 hover:border-violet-500/40 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-lg">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {candidate.post_contested}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium flex items-center gap-1 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  {candidate.approval_status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                {candidate.candidate_name}
              </h3>
              <p className="text-xs text-slate-400">
                {candidate.department} • Year {candidate.year_of_study}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400">Polled Votes</div>
            <div className="text-lg font-bold text-violet-300 font-mono">
              {candidate.vote_count.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Campaign Tagline */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            "{candidate.campaign_tagline}"
          </div>
          <p className="text-xs text-slate-300 italic">
            "{candidate.manifesto_slogan}"
          </p>
        </div>

        {/* Key Initiatives */}
        <div className="space-y-2 mb-6">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Key Manifesto Pillars
          </div>
          <ul className="space-y-1.5">
            {candidate.key_initiatives.map((init, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-violet-400 font-bold shrink-0">•</span>
                <span>{init}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-500 font-mono">
          Roll: {candidate.scholar_id}
        </span>
        {onVoteClick && (
          <button
            onClick={() => onVoteClick(candidate)}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/30 transition-all flex items-center gap-1.5"
          >
            <Vote className="w-4 h-4" />
            Cast Anonymous Ballot
          </button>
        )}
      </div>
    </div>
  );
}
