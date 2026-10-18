"use client";

import React from "react";
import { UgcCurriculumRevision } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  CheckCircle2,
  Calendar,
  Briefcase,
  Layers,
  Sparkles,
} from "lucide-react";

interface CurriculumRevisionCardProps {
  revision: UgcCurriculumRevision;
}

export function CurriculumRevisionCard({ revision }: CurriculumRevisionCardProps) {
  const getRevisionBadge = (type: string) => {
    switch (type) {
      case "full_curriculum_revision":
        return {
          label: "Full CBCS Autonomous Revision",
          color: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
        };
      case "nep_multidisciplinary_minor":
        return {
          label: "NEP 2020 Multidisciplinary Minor",
          color: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
        };
      case "industry_internship_embed":
        return {
          label: "Industry Practice Embedded Track",
          color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        };
      case "elective_basket_update":
        return {
          label: "Advanced Electives Restructuring",
          color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
        };
      default:
        return {
          label: "Autonomous Syllabus Update",
          color: "bg-muted text-muted-foreground border-border",
        };
    }
  };

  const badge = getRevisionBadge(revision.revision_type);

  return (
    <Card className="overflow-hidden border-border/80 bg-card/60 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-md">
      <CardContent className="p-4 space-y-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-[10px] font-medium ${badge.color}`}>
                {badge.label}
              </Badge>
              <span className="font-mono text-xs font-semibold text-primary">{revision.program_code}</span>
            </div>
            <h4 className="text-sm font-semibold text-foreground pt-0.5">{revision.program_name}</h4>
            <p className="text-xs text-muted-foreground">{revision.department}</p>
          </div>

          <Badge
            variant="outline"
            className="text-[10px] gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shrink-0"
          >
            <CheckCircle2 className="h-3 w-3" />
            Academic Council Ratified
          </Badge>
        </div>

        {/* Framework & Credits breakdown */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <Layers className="h-3.5 w-3.5 text-primary" />
              <span>Total Credits</span>
            </div>
            <span className="text-base font-bold text-foreground">{revision.total_credits} Credits</span>
            <p className="text-[10px] text-muted-foreground mt-0.5">{revision.regulation_year}</p>
          </div>

          <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <Briefcase className="h-3.5 w-3.5 text-emerald-600" />
              <span>Industry Practice Component</span>
            </div>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
              {revision.industry_component_pct}%
            </span>
            <p className="text-[10px] text-muted-foreground mt-0.5">Internship & Hands-on Lab</p>
          </div>
        </div>

        {/* Approval Timeline & Docket */}
        <div className="p-2.5 rounded-lg bg-muted/30 border border-border/40 space-y-1 text-xs">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-muted-foreground">Board of Studies (BoS) Approved:</span>
            <span className="font-medium text-foreground">{revision.bos_approval_date}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-muted-foreground">Academic Council (AC) Ratified:</span>
            <span className="font-medium text-foreground">{revision.academic_council_approval_date}</span>
          </div>
        </div>

        {/* Footer Docket */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
          <span className="text-[11px] text-muted-foreground">Autonomous Curriculum Docket</span>
          <span className="font-mono text-[10px] font-semibold text-primary">{revision.curriculum_docket_token}</span>
        </div>
      </CardContent>
    </Card>
  );
}
