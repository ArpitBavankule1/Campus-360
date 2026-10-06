"use client";

import React from "react";
import { CounselingSession } from "@/types";
import { HeartHandshake, ShieldCheck, Video, Building, PhoneCall, Calendar, Clock, Key } from "lucide-react";

interface CounselorSessionCardProps {
  session: CounselingSession;
  onViewPass?: (session: CounselingSession) => void;
}

export function CounselorSessionCard({ session, onViewPass }: CounselorSessionCardProps) {
  const isConfirmed = session.status === "Confirmed";
  const isInSession = session.status === "In Session";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-6 hover:border-violet-500/40 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl border bg-violet-500/10 border-violet-500/20 text-violet-400">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                    isConfirmed
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : isInSession
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {session.status}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                  {session.session_code}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                {session.counselor_name}
              </h3>
              <p className="text-xs text-violet-300/80">
                {session.counselor_specialization}
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Session Category:</span>
            <span className="font-semibold text-slate-200">{session.session_type}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Consultation Mode:</span>
            <span className="font-semibold text-violet-300 flex items-center gap-1">
              {session.mode === "Confidential Video Call" && <Video className="w-3.5 h-3.5" />}
              {session.mode === "Infirmary Wellness Suite" && <Building className="w-3.5 h-3.5" />}
              {session.mode === "Anonymous Voice Line" && <PhoneCall className="w-3.5 h-3.5" />}
              {session.mode}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Date & Time:
            </span>
            <span className="font-mono text-slate-300 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {session.scheduled_date} • {session.scheduled_time_slot}
            </span>
          </div>
        </div>

        {/* Confidentiality and Security Token */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs mb-3">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="text-[11px] font-medium">HIPAA/UGC Confidential Encrypted</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
            <Key className="w-3 h-3 text-violet-400" />
            <span>{session.access_pass_token.slice(0, 16)}...</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Client: {session.scholar_name} ({session.scholar_id})
        </span>
        {onViewPass && (
          <button
            onClick={() => onViewPass(session)}
            className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md shadow-violet-600/20 transition-all"
          >
            Access Session Room
          </button>
        )}
      </div>
    </div>
  );
}
