"use client";

import React from "react";
import { NbaCourseOutcome } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, BookOpen, User, Layers } from "lucide-react";

interface CoPoMatrixCardProps {
  outcome: NbaCourseOutcome;
  onEdit?: (outcome: NbaCourseOutcome) => void;
}

export function CoPoMatrixCard({ outcome }: CoPoMatrixCardProps) {
  const getBloomBadge = (level: string) => {
    switch (level) {
      case "Remember":
      case "Understand":
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30";
      case "Apply":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30";
      case "Analyze":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30";
      case "Evaluate":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
      case "Create":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const isAttained = outcome.final_attainment_score >= outcome.target_score;

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-border/80 bg-card">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="font-mono font-bold bg-primary/10 text-primary border-primary/30">
              {outcome.course_code} - {outcome.co_code}
            </Badge>
            <Badge variant="outline" className={`font-semibold text-xs ${getBloomBadge(outcome.bloom_level)}`}>
              {outcome.bloom_level} Level
            </Badge>
          </div>
          {isAttained ? (
            <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/30 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3 h-3" /> Attained
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/30 flex items-center gap-1 font-semibold">
              <AlertCircle className="w-3 h-3" /> Substantially Attained
            </Badge>
          )}
        </div>

        <CardTitle className="text-sm font-semibold text-foreground mt-2 line-clamp-1 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-primary shrink-0" />
          {outcome.course_name}
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 italic">
          &ldquo;{outcome.statement}&rdquo;
        </p>
      </CardHeader>

      <CardContent className="space-y-3 pt-1">
        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-muted/40 border border-border/50 text-center">
          <div>
            <span className="text-[10px] text-muted-foreground block">Direct (CIE+SEE)</span>
            <span className="text-xs font-bold text-foreground">{outcome.direct_attainment_pct}%</span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Indirect Survey</span>
            <span className="text-xs font-bold text-foreground">{outcome.indirect_attainment_pct}%</span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Attained Index</span>
            <span className="text-sm font-black text-primary">
              {outcome.final_attainment_score.toFixed(2)}{" "}
              <span className="text-[10px] font-normal text-muted-foreground">/ 3.0</span>
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3 text-primary" />
            <span>Faculty: <strong className="text-foreground">{outcome.faculty_in_charge}</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <Layers className="w-3 h-3 text-primary" />
            <span>Sem: <strong className="text-foreground">{outcome.semester}</strong></span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
