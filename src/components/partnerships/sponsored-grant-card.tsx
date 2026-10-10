"use client";

import React from "react";
import { SponsoredGrant } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  IndianRupee,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
} from "lucide-react";

interface SponsoredGrantCardProps {
  grant: SponsoredGrant;
}

export function SponsoredGrantCard({ grant }: SponsoredGrantCardProps) {
  const getGrantTypeBadge = (type: string) => {
    switch (type) {
      case "sponsored_research":
        return { label: "Sponsored Research", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30" };
      case "corporate_csr":
        return { label: "Corporate CSR Fund", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" };
      case "faculty_chair":
        return { label: "Endowed Chair", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30" };
      default:
        return { label: "Industry Grant", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30" };
    }
  };

  const badgeInfo = getGrantTypeBadge(grant.grant_type);
  const formattedAmount = (grant.grant_amount_inr / 100000).toFixed(1);
  const formattedDisbursed = (grant.disbursed_amount_inr / 100000).toFixed(1);
  const progressPct = Math.round((grant.disbursed_amount_inr / grant.grant_amount_inr) * 100);

  return (
    <Card className="border border-border/60 bg-card/60 backdrop-blur-md shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/40 bg-muted/15">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={`text-xs font-semibold ${badgeInfo.color}`}>
                {badgeInfo.label}
              </Badge>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold">
                {grant.grant_token}
              </span>
            </div>
            <CardTitle className="text-base font-bold tracking-tight text-foreground line-clamp-2 mt-1">
              {grant.project_title}
            </CardTitle>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Layers className="w-3 h-3 text-primary" /> {grant.sponsor_name} • {grant.department}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-2 text-xs bg-muted/30 p-2.5 rounded-lg border border-border/40">
          <div>
            <span className="text-muted-foreground block text-[11px]">Total Grant Outlay</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-0.5">
              <IndianRupee className="w-3.5 h-3.5" />
              ₹{formattedAmount} Lakhs
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Disbursed Capital</span>
            <span className="font-medium text-foreground flex items-center gap-0.5 mt-0.5">
              <IndianRupee className="w-3 h-3 text-muted-foreground" />
              ₹{formattedDisbursed} Lakhs ({progressPct}%)
            </span>
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
            <span>Milestones Progress</span>
            <span>{grant.milestones.filter(m => m.delivered).length} / {grant.milestones.length} Completed</span>
          </div>
          <div className="w-full bg-muted/50 h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${(grant.milestones.filter(m => m.delivered).length / grant.milestones.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Milestone list */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-primary" /> Key Active Milestone:
          </span>
          {grant.milestones[0] && (
            <div className="text-xs p-2 rounded bg-muted/20 border border-border/30 flex items-center justify-between">
              <span className="line-clamp-1">{grant.milestones[0].title}</span>
              <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{grant.milestones[0].target_date}</span>
            </div>
          )}
        </div>

        <div className="text-[11px] text-muted-foreground border-t border-border/30 pt-2 flex items-center justify-between">
          <span>PI: <strong>{grant.principal_investigator}</strong></span>
          <span className="font-mono text-[10px] text-muted-foreground">{grant.start_date} → {grant.end_date}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-3 border-t border-border/40 bg-muted/10 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1 text-[11px]">
          <FileText className="w-3 h-3 text-primary" /> {grant.deliverables.length} Deliverable Dockets
        </span>
        <Badge variant="outline" className="text-[10px] uppercase font-bold text-blue-600 bg-blue-500/10">
          {grant.status}
        </Badge>
      </CardFooter>
    </Card>
  );
}
