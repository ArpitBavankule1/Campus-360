"use client";

import React from "react";
import { ResearchGrant } from "@/types";
import {
  Award,
  Calendar,
  DollarSign,
  TrendingUp,
  UserCheck,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface GrantProgressCardProps {
  grant: ResearchGrant;
}

export function GrantProgressCard({ grant }: GrantProgressCardProps) {
  const percent = Math.min(
    100,
    Math.round((grant.disbursed_amount / grant.total_grant_amount) * 100)
  );

  const getAgencyBadge = () => {
    switch (grant.funding_agency) {
      case "DST":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "ISRO":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "SERB":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      default:
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    }
  };

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm space-y-4 transition-all hover:border-primary/40 hover:shadow-md flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getAgencyBadge()}`}
          >
            {grant.funding_agency} Research Grant
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 capitalize">
            {grant.milestone_status}
          </span>
        </div>

        <div>
          <h4 className="text-base font-bold text-foreground leading-snug">
            {grant.project_title}
          </h4>
          <p className="text-xs text-primary font-medium mt-1">
            PI: {grant.principal_investigator}
          </p>
          {grant.co_pis.length > 0 && (
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Co-PIs: {grant.co_pis.join(", ")}
            </p>
          )}
        </div>

        {/* Budget Progress Bar */}
        <div className="space-y-1.5 p-3 rounded-2xl bg-muted/40 border border-border/40">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Disbursed Tranche</span>
            <span className="font-bold text-foreground">
              ₹{(grant.disbursed_amount / 100000).toFixed(1)}L / ₹{(grant.total_grant_amount / 100000).toFixed(1)}L
            </span>
          </div>

          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>

          <p className="text-[10px] text-primary font-semibold pt-0.5">
            {percent}% Capital Outlay Utilized
          </p>
        </div>

        {grant.deliverables_summary && (
          <p className="text-xs text-muted-foreground/90 italic">
            "{grant.deliverables_summary}"
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Timeline: {grant.start_date} to {grant.end_date}</span>
      </div>
    </div>
  );
}
