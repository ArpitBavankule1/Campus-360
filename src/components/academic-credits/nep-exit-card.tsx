"use client";

import React from "react";
import { NepExitQualification } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  GraduationCap,
  Award,
  CheckCircle2,
  Clock,
  FileCheck,
  Calendar,
} from "lucide-react";

interface NepExitCardProps {
  exitDocket: NepExitQualification;
}

export function NepExitCard({ exitDocket }: NepExitCardProps) {
  const getExitLevelInfo = (level: string) => {
    switch (level) {
      case "honours_research":
        return {
          title: "Bachelor's Degree (Honours with Research)",
          duration: "4 Years (8 Semesters)",
          badgeColor: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
        };
      case "degree":
        return {
          title: "Bachelor's Degree in Discipline",
          duration: "3 Years (6 Semesters)",
          badgeColor: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
        };
      case "diploma":
        return {
          title: "Undergraduate Diploma in Discipline",
          duration: "2 Years (4 Semesters)",
          badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
        };
      case "certificate":
        return {
          title: "Undergraduate Certificate in Field",
          duration: "1 Year (2 Semesters)",
          badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        };
      default:
        return {
          title: level,
          duration: "N/A",
          badgeColor: "bg-muted text-muted-foreground border-border",
        };
    }
  };

  const getDocketStatusBadge = (status: string) => {
    switch (status) {
      case "docket_awarded":
        return {
          label: "Degree / Docket Awarded",
          color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
          icon: CheckCircle2,
        };
      case "application_filed":
        return {
          label: "Exit Application Filed",
          color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
          icon: Clock,
        };
      case "eligible":
        return {
          label: "Eligible for Exit",
          color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
          icon: Award,
        };
      default:
        return {
          label: "Deferred / In-Progress",
          color: "bg-muted text-muted-foreground border-border",
          icon: Clock,
        };
    }
  };

  const info = getExitLevelInfo(exitDocket.target_exit_level);
  const st = getDocketStatusBadge(exitDocket.exit_status);
  const StatusIcon = st.icon;

  const pct = Math.min(
    100,
    Math.round((exitDocket.completed_credits / exitDocket.required_credits) * 100)
  );

  return (
    <Card className="border-border/80 bg-card/60 backdrop-blur-sm overflow-hidden transition-all hover:border-primary/40 hover:shadow-md">
      <CardContent className="p-4 space-y-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-foreground">{exitDocket.student_name}</span>
              <span className="text-xs font-mono text-muted-foreground">({exitDocket.apaar_id})</span>
            </div>
            <div className="text-xs text-muted-foreground">{exitDocket.program_enrolled}</div>
          </div>

          <Badge variant="outline" className={`text-[11px] gap-1 font-medium ${st.color}`}>
            <StatusIcon className="h-3 w-3" />
            {st.label}
          </Badge>
        </div>

        {/* Level Details */}
        <div className="p-3 rounded-lg bg-muted/40 border border-border/50 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span>{info.title}</span>
            </div>
            <Badge variant="outline" className={`text-[10px] ${info.badgeColor}`}>
              {info.duration}
            </Badge>
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Credit Attainment:</span>
              <span className="font-bold text-foreground">
                {exitDocket.completed_credits} / {exitDocket.required_credits} Credits ({pct}%)
              </span>
            </div>
            <Progress value={pct} className="h-2 bg-muted" />
          </div>
        </div>

        {/* Signoff / Council Approval */}
        <div className="flex flex-wrap items-center justify-between text-xs pt-1 border-t border-border/40 gap-2">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
            <FileCheck className="h-3.5 w-3.5" />
            <span>Docket: {exitDocket.qualification_docket_token}</span>
          </div>

          {exitDocket.convocation_signoff_date && (
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
              <Calendar className="h-3 w-3" />
              <span>Convocation: {exitDocket.convocation_signoff_date}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
