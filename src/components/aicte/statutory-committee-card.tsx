"use client";

import React from "react";
import { AicteStatutoryCommittee } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  Calendar,
  FileText,
  UserCheck,
} from "lucide-react";

interface StatutoryCommitteeCardProps {
  committee: AicteStatutoryCommittee;
  onRecordMinutes?: (committee: AicteStatutoryCommittee) => void;
}

export function StatutoryCommitteeCard({
  committee,
  onRecordMinutes,
}: StatutoryCommitteeCardProps) {
  const getCommitteeBadge = (type: string) => {
    switch (type) {
      case "anti_ragging":
        return { label: "Supreme Court / UGC Mandate", color: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30" };
      case "icc_posh":
        return { label: "POSH Act 2013 Statutory Cell", color: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30" };
      case "sc_st_cell":
        return { label: "SC/ST Prevention of Atrocities", color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30" };
      case "grievance_sgrc":
        return { label: "Ombudsman Grievance Cell", color: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30" };
      case "industry_cell":
        return { label: "Industry Alliances IIIC", color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" };
      default:
        return { label: "Statutory Body", color: "bg-muted text-muted-foreground border-border" };
    }
  };

  const badge = getCommitteeBadge(committee.committee_type);

  return (
    <Card className="overflow-hidden border-border/80 bg-card/60 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-md">
      <CardContent className="p-4 space-y-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <Badge variant="outline" className={`text-[10px] font-medium ${badge.color}`}>
              {badge.label}
            </Badge>
            <h4 className="text-sm font-semibold text-foreground pt-1">{committee.committee_name}</h4>
          </div>

          <Badge variant="outline" className="text-[10px] gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
            <CheckCircle2 className="h-3 w-3" />
            Statutory Compliant
          </Badge>
        </div>

        {/* Member Details */}
        <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Chairperson:</span>
            <span className="font-semibold text-foreground">{committee.chairperson_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">External Nominee:</span>
            <span className="font-medium text-foreground">{committee.external_member_name}</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-border/40">
            <span className="text-muted-foreground">Total Quorum Members:</span>
            <span className="font-bold text-primary">{committee.total_members} Members</span>
          </div>
        </div>

        {/* Minutes of Meeting Docket */}
        <div className="flex flex-wrap items-center justify-between text-xs pt-1 border-t border-border/40 gap-2">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>Last Quorum: {committee.last_meeting_date}</span>
          </div>

          <div className="flex items-center gap-1 font-mono text-[10px] text-primary">
            <FileText className="h-3 w-3" />
            <span>MoM: {committee.mom_docket_token}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
