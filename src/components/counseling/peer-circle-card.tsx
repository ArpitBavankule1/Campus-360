"use client";

import React from "react";
import { PeerSupportCircle } from "@/types";
import { Users, Sparkles, MapPin, Calendar, Lock } from "lucide-react";

interface PeerCircleCardProps {
  circle: PeerSupportCircle;
  onJoin?: (circle: PeerSupportCircle) => void;
}

export function PeerCircleCard({ circle, onJoin }: PeerCircleCardProps) {
  const isFull = circle.status === "Full Capacity";
  const percentFilled = Math.min(100, Math.round((circle.enrolled_count / circle.max_participants) * 100));

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-6 hover:border-teal-500/40 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                isFull
                  ? "bg-slate-800 text-slate-400 border border-slate-700"
                  : "bg-teal-500/10 text-teal-400 border border-teal-500/20"
              }`}
            >
              {circle.status}
            </span>
            {circle.is_anonymous && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1 font-medium">
                <Lock className="w-3 h-3" /> Anonymous Identities
              </span>
            )}
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-800/80 text-teal-300 font-medium">
            {circle.theme}
          </span>
        </div>

        <h3 className="text-base font-bold text-white mb-1.5 leading-snug">
          {circle.circle_name}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span>Led by: <span className="text-slate-200 font-medium">{circle.facilitator_name}</span></span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 mb-4 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>{circle.schedule_info}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{circle.meeting_venue}</span>
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-400 flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-400" /> Circle Fellowship Capacity
            </span>
            <span className="font-semibold text-slate-200">
              {circle.enrolled_count} / {circle.max_participants} Peers
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFull ? "bg-amber-500" : "bg-teal-500"
              }`}
              style={{ width: `${percentFilled}%` }}
            />
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800 flex items-center justify-end">
        {onJoin && (
          <button
            onClick={() => onJoin(circle)}
            disabled={isFull}
            className="w-full py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-md shadow-teal-600/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isFull ? "Circle Full (Waitlist Only)" : "Join Peer Circle Anonymously"}
          </button>
        )}
      </div>
    </div>
  );
}
