"use client";

import React from "react";
import { SeatAllotmentDocket } from "@/types";
import {
  CheckCircle2,
  AlertCircle,
  FileBadge,
  Calendar,
  IndianRupee,
  ShieldCheck,
  Download,
  Award,
} from "lucide-react";

interface SeatAllotmentCardProps {
  docket: SeatAllotmentDocket;
  onAcceptSeat?: (docket: SeatAllotmentDocket) => void;
  onDownloadLetter?: (docket: SeatAllotmentDocket) => void;
}

export function SeatAllotmentCard({
  docket,
  onAcceptSeat,
  onDownloadLetter,
}: SeatAllotmentCardProps) {
  const isAccepted = docket.is_seat_accepted;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-6 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
              <FileBadge className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                    isAccepted
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}
                >
                  {isAccepted ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Seat Confirmed & Locked
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
                      Pending Acceptance
                    </>
                  )}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                  {docket.allotment_number}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                {docket.candidate_name}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                App Ref: {docket.application_number}
              </p>
            </div>
          </div>
        </div>

        {/* Allotment Details Box */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Allotted Program:</span>
            <span className="font-semibold text-slate-200 text-right truncate max-w-[200px]">
              {docket.program_name}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Counseling Cycle:</span>
            <span className="font-medium text-blue-400">{docket.counseling_round}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Allotted Quota / Category:</span>
            <span className="font-semibold text-purple-300">{docket.allotted_category}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Merit Rank:
            </span>
            <span className="font-mono font-bold text-amber-400">
              AIR #{docket.merit_rank}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
            <span className="text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Reporting Deadline:
            </span>
            <span className="font-mono text-slate-300">{docket.acceptance_deadline}</span>
          </div>
        </div>

        {/* Escrow Lock Deposit Verification */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs mb-3">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="text-[11px] font-medium">Institutional Escrow Deposit</span>
          </div>
          <span className="font-mono text-slate-300 font-semibold flex items-center">
            <IndianRupee className="w-3 h-3 text-slate-400" />
            {docket.seat_lock_deposit_inr.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
        <button
          onClick={() => onDownloadLetter && onDownloadLetter(docket)}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Offer Letter
        </button>

        {!isAccepted && onAcceptSeat && (
          <button
            onClick={() => onAcceptSeat(docket)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Lock & Accept Seat
          </button>
        )}

        {isAccepted && (
          <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Admittance Docket Verified
          </span>
        )}
      </div>
    </div>
  );
}
