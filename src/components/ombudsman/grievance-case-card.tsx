"use client";

import React from "react";
import { GrievanceCase } from "@/types";
import {
  Scale,
  Clock,
  ShieldAlert,
  UserCheck,
  AlertTriangle,
  Lock,
  ChevronRight,
} from "lucide-react";

interface GrievanceCaseCardProps {
  caseItem: GrievanceCase;
  onView?: (caseItem: GrievanceCase) => void;
}

export function GrievanceCaseCard({ caseItem, onView }: GrievanceCaseCardProps) {
  const getCategoryBadge = () => {
    switch (caseItem.category) {
      case "Anti-Ragging Squad":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case "Internal Complaints Committee (ICC)":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "Academic Evaluation & Exams":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      default:
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    }
  };

  const getUrgencyBadge = () => {
    if (caseItem.urgency_level === "Critical Emergency") {
      return "text-destructive font-bold animate-pulse";
    }
    if (caseItem.urgency_level === "High Priority") {
      return "text-amber-600 dark:text-amber-400 font-semibold";
    }
    return "text-muted-foreground font-medium";
  };

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm space-y-4 transition-all hover:border-primary/40 hover:shadow-md flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getCategoryBadge()}`}
            >
              {caseItem.category}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/50">
              {caseItem.escalation_tier}
            </span>
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border font-mono ${
              caseItem.status === "Resolved"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : caseItem.status === "Under Hearing"
                ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
            }`}
          >
            {caseItem.status}
          </span>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-primary mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>{caseItem.tracking_hash}</span>
          </div>
          <h3 className="font-bold text-base text-foreground leading-snug">
            {caseItem.title}
          </h3>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
          {caseItem.description}
        </p>

        {/* Masked identity */}
        <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-2xl border border-border/40">
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-primary" />
            <span>Filer: <strong className="text-foreground">{caseItem.complainant_masked_id}</strong></span>
          </div>
          <div className={`text-[11px] flex items-center gap-1 ${getUrgencyBadge()}`}>
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{caseItem.urgency_level}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1 font-mono text-[11px]">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>SLA Deadline: {new Date(caseItem.sla_deadline).toLocaleDateString()}</span>
        </span>

        <button
          onClick={() => onView?.(caseItem)}
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
        >
          <span>Track Case</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
