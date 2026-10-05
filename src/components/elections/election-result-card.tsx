"use client";

import React from "react";
import { ElectionResultDocket } from "@/types";
import { Trophy, CheckCircle2, ShieldCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface ElectionResultCardProps {
  result: ElectionResultDocket;
}

export function ElectionResultCard({ result }: ElectionResultCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-slate-900/60 to-slate-900/90 backdrop-blur-md p-6 shadow-xl">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {result.post_contested} • Winner
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Certified Mandate
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white mt-1">
              {result.winner_candidate_name}
            </h3>
            <p className="text-xs text-slate-400">
              Won by a margin of <span className="text-amber-400 font-bold">{result.winning_margin_votes}</span> votes
            </p>
          </div>
        </div>

        <div className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-200">
          <QRCodeSVG value={result.certificate_code} size={50} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-800 text-xs">
        <div>
          <span className="text-slate-400">Total Votes Polled:</span>
          <div className="font-bold text-slate-200 text-sm">{result.total_votes_polled.toLocaleString()}</div>
        </div>
        <div>
          <span className="text-slate-400">Voter Turnout Rate:</span>
          <div className="font-bold text-emerald-400 text-sm">{result.voter_turnout_pct}%</div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Certified by: <strong className="text-slate-300">{result.certified_by}</strong></span>
        </div>
        <span className="font-mono text-indigo-400">{result.certificate_code}</span>
      </div>
    </div>
  );
}
