"use client";

import React from "react";
import { InternationalScholarship } from "@/types";
import {
  Award,
  DollarSign,
  Calendar,
  Building2,
  CheckCircle2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface GlobalScholarshipCardProps {
  scholarship: InternationalScholarship;
  onApply?: (scholarship: InternationalScholarship) => void;
}

export function GlobalScholarshipCard({
  scholarship,
  onApply,
}: GlobalScholarshipCardProps) {
  const getCoverageBadge = () => {
    switch (scholarship.coverage_type) {
      case "Full Tuition + Living":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "Full Tuition Only":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "Travel & Research Grant":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      default:
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
    }
  };

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm space-y-4 transition-all hover:border-primary/40 hover:shadow-md flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getCoverageBadge()}`}
          >
            {scholarship.coverage_type}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full font-mono shrink-0">
            <Users className="w-3 h-3 text-primary" />
            <span>{scholarship.open_slots} Openings</span>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-base text-foreground leading-snug">
            {scholarship.fellowship_title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">{scholarship.sponsoring_body}</span>
          </div>
        </div>

        {/* Award Amount Banner */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 flex items-center justify-between">
          <div className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
            Maximum Funding Award
          </div>
          <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-extrabold text-base font-mono">
            <DollarSign className="w-4 h-4 -mr-0.5" />
            {scholarship.award_amount_usd.toLocaleString("en-US", {
              minimumFractionDigits: 0,
            })}{" "}
            USD
          </div>
        </div>

        {/* Eligibility */}
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-foreground/80 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Eligibility:
          </span>
          <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
            {scholarship.eligibility_criteria}
          </p>
        </div>

        {/* Target Countries */}
        <div className="flex flex-wrap gap-1 pt-1">
          {scholarship.target_countries.map((country, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-foreground/80 border border-border/50"
            >
              🌍 {country}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-border/50 space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Deadline:{" "}
            <span className="text-foreground font-semibold">
              {new Date(scholarship.application_deadline).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </span>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase">
            Active Call
          </span>
        </div>

        <Button
          size="sm"
          className="w-full rounded-xl text-xs h-8.5 gap-1.5 bg-primary text-primary-foreground font-medium shadow-xs"
          onClick={() => onApply?.(scholarship)}
        >
          <Award className="w-3.5 h-3.5" />
          Apply for Fellowship
        </Button>
      </div>
    </div>
  );
}
