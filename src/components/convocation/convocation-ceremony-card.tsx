"use client";

import React from "react";
import { ConvocationCeremony } from "@/types";
import { Calendar, Clock, MapPin, UserCheck, Sparkles, Shirt } from "lucide-react";

interface ConvocationCeremonyCardProps {
  ceremony: ConvocationCeremony;
  onRegisterClick?: () => void;
}

export function ConvocationCeremonyCard({
  ceremony,
  onRegisterClick,
}: ConvocationCeremonyCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-900/90 backdrop-blur-md p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            {ceremony.academic_session} Official Convocation
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {ceremony.edition_title}
          </h2>
          <p className="text-sm text-slate-300 mt-1 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            Chief Guest: <span className="font-semibold text-white">{ceremony.chief_guest_name}</span> ({ceremony.chief_guest_designation})
          </p>
        </div>

        {onRegisterClick && (
          <button
            onClick={onRegisterClick}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Shirt className="w-4 h-4" />
            Reserve Regalia & Pass
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <div>
            <div className="text-slate-400">Ceremony Date</div>
            <div className="font-semibold text-slate-200 mt-0.5">{ceremony.ceremony_date}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
          <Clock className="w-5 h-5 text-indigo-400" />
          <div>
            <div className="text-slate-400">Procession Time</div>
            <div className="font-semibold text-slate-200 mt-0.5">{ceremony.ceremony_time}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
          <MapPin className="w-5 h-5 text-indigo-400" />
          <div>
            <div className="text-slate-400">Convocation Venue</div>
            <div className="font-semibold text-slate-200 mt-0.5">{ceremony.venue_auditorium}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div>
          <span className="text-slate-500">Regalia Dress Code: </span>
          <span className="text-slate-300 font-medium">{ceremony.regalia_dress_code}</span>
        </div>
        <div>
          <span className="text-slate-500">Degrees to be Awarded: </span>
          <span className="font-bold text-indigo-300">{ceremony.total_degrees_awarded.toLocaleString()} Scholars</span>
        </div>
      </div>
    </div>
  );
}
