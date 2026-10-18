"use client";

import React from "react";
import { UgcStatutoryCouncil } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Landmark,
  Users,
  CheckCircle2,
  Calendar,
  FileText,
  UserCheck,
  Building2,
  Award,
} from "lucide-react";

interface StatutoryBodyCardProps {
  council: UgcStatutoryCouncil;
  onConveneMeeting?: (council: UgcStatutoryCouncil) => void;
}

export function StatutoryBodyCard({
  council,
  onConveneMeeting,
}: StatutoryBodyCardProps) {
  const getCouncilMeta = (type: string) => {
    switch (type) {
      case "governing_body":
        return {
          label: "Apex Institutional Governing Body",
          icon: Landmark,
          color: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
        };
      case "academic_council":
        return {
          label: "Autonomous Academic Council",
          icon: Award,
          color: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
        };
      case "board_of_studies":
        return {
          label: "Board of Studies (BoS)",
          icon: Building2,
          color: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
        };
      case "finance_committee":
        return {
          label: "Standing Finance Committee",
          icon: FileText,
          color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        };
      case "examination_cell":
        return {
          label: "Controller of Examinations Cell",
          icon: Users,
          color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
        };
      default:
        return {
          label: "UGC Statutory Body",
          icon: Landmark,
          color: "bg-muted text-muted-foreground border-border",
        };
    }
  };

  const meta = getCouncilMeta(council.council_type);
  const IconComponent = meta.icon;

  return (
    <Card className="overflow-hidden border-border/80 bg-card/60 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-md">
      <CardContent className="p-4 space-y-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <Badge variant="outline" className={`text-[10px] font-medium ${meta.color}`}>
              <IconComponent className="mr-1 h-3 w-3" />
              {meta.label}
            </Badge>
            <h4 className="text-sm font-semibold text-foreground pt-0.5">{council.council_name}</h4>
          </div>

          <Badge
            variant="outline"
            className="text-[10px] gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shrink-0"
          >
            <CheckCircle2 className="h-3 w-3" />
            UGC Quorum Compliant
          </Badge>
        </div>

        {/* Member Composition details */}
        <div className="p-3 rounded-lg bg-muted/40 border border-border/50 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Chairperson:</span>
            <span className="font-semibold text-foreground text-right">{council.chairperson}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">University Nominee:</span>
            <span className="font-medium text-foreground text-right">{council.university_nominee}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">UGC Expert Nominee:</span>
            <span className="font-medium text-primary text-right">{council.ugc_nominee}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">State Govt Nominee:</span>
            <span className="font-medium text-foreground text-right">{council.state_gov_nominee}</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-border/40">
            <span className="text-muted-foreground">Statutory Tenure:</span>
            <span className="font-bold text-foreground">{council.tenure_period} • {council.total_members} Members</span>
          </div>
        </div>

        {/* Meetings & Resolution Token */}
        <div className="flex flex-wrap items-center justify-between text-xs pt-1 border-t border-border/40 gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 text-emerald-600" />
              <span>Last Quorum: <strong className="text-foreground">{council.last_meeting_date}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>Next Meeting: <strong className="text-primary">{council.next_meeting_date}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-[10px] text-muted-foreground block">Formal Resolution</span>
              <span className="font-mono text-[10px] font-semibold text-foreground">{council.resolution_token}</span>
            </div>
            {onConveneMeeting && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs border-primary/30 text-primary hover:bg-primary/10"
                onClick={() => onConveneMeeting(council)}
              >
                Convene
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
