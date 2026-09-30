"use client";

import React from "react";
import { StudentMeritActivity } from "@/types";
import {
  Award,
  Trophy,
  CheckCircle2,
  Calendar,
  Sparkles,
  Medal,
  Download,
} from "lucide-react";

interface ActivityMeritBadgeProps {
  activities: StudentMeritActivity[];
  totalPoints: number;
}

export function ActivityMeritBadge({
  activities,
  totalPoints,
}: ActivityMeritBadgeProps) {
  const getScholarTier = () => {
    if (totalPoints >= 40) return { label: "Gold Co-Curricular Scholar", color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/30" };
    if (totalPoints >= 20) return { label: "Silver Activity Scholar", color: "text-zinc-400", bg: "bg-zinc-500/10 border-zinc-500/30" };
    return { label: "Bronze Participant", color: "text-amber-700", bg: "bg-amber-700/10 border-amber-700/30" };
  };

  const tier = getScholarTier();

  return (
    <div className="space-y-4">
      {/* Overview Banner */}
      <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card/90 to-primary/5 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-amber-500/15 text-amber-500">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${tier.bg} ${tier.color}`}>
                {tier.label}
              </span>
              <span className="text-xs text-muted-foreground">Apex Student Council Ledger</span>
            </div>
            <h3 className="text-2xl font-black text-foreground mt-1">
              {totalPoints} Activity Merit Points
            </h3>
            <p className="text-xs text-muted-foreground">
              Official points recognized toward University Honors Degree & Graduation Transcripts
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-background/80 border border-border/60 text-center shrink-0">
          <div className="text-xs font-semibold text-muted-foreground uppercase">
            Dean Endorsement
          </div>
          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1 mt-1">
            <CheckCircle2 className="w-4 h-4" />
            Verified & Certified
          </div>
        </div>
      </div>

      {/* Activity Records Ledger */}
      <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
        <h4 className="text-base font-bold text-foreground flex items-center gap-2">
          <Medal className="w-4 h-4 text-primary" />
          Co-Curricular & Competitive Achievements
        </h4>

        <div className="space-y-3">
          {activities.map((act) => (
            <div
              key={act.id}
              className="p-4 rounded-2xl bg-muted/30 border border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  {act.activity_type.replace("_", " ")}
                </span>
                <h5 className="text-sm font-bold text-foreground mt-0.5">
                  {act.activity_title}
                </h5>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Endorsed by {act.verified_by} • Awarded on {new Date(act.awarded_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black text-xs border border-amber-500/20">
                  +{act.merit_points} Pts
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
