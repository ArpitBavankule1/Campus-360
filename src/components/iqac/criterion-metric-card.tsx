"use client";

import React, { useState } from "react";
import { IqacCriterionMetric } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  UserCheck,
  TrendingUp,
  Target,
  Clock,
  ShieldCheck,
} from "lucide-react";

interface CriterionMetricCardProps {
  criterion: IqacCriterionMetric;
  onUpdateScore?: (criterion: IqacCriterionMetric) => void;
}

export function CriterionMetricCard({
  criterion,
  onUpdateScore,
}: CriterionMetricCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getCriterionBadge = (code: string) => {
    switch (code) {
      case "CRITERION_1":
        return { label: "Criterion 1: Curricular", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30" };
      case "CRITERION_2":
        return { label: "Criterion 2: Teaching-Learning", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" };
      case "CRITERION_3":
        return { label: "Criterion 3: Research & Extension", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30" };
      case "CRITERION_4":
        return { label: "Criterion 4: Infrastructure", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30" };
      case "CRITERION_5":
        return { label: "Criterion 5: Student Progression", color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30" };
      case "CRITERION_6":
        return { label: "Criterion 6: Governance & Mgmt", color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30" };
      case "CRITERION_7":
        return { label: "Criterion 7: Institutional Values", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30" };
      default:
        return { label: code, color: "bg-muted text-muted-foreground" };
    }
  };

  const badgeInfo = getCriterionBadge(criterion.criterion_code);
  const scorePercent = Math.min(
    100,
    Math.round((criterion.current_score / criterion.max_weightage) * 100)
  );

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-border/80">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="outline" className={`font-mono text-xs ${badgeInfo.color}`}>
            {badgeInfo.label}
          </Badge>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">SSR Readiness:</span>
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
              {criterion.ssr_readiness_percentage}% Ready
            </Badge>
          </div>
        </div>
        <CardTitle className="text-base font-bold mt-2 text-foreground flex items-center justify-between">
          <span>{criterion.criterion_title}</span>
          <span className="text-sm font-mono font-medium text-muted-foreground">
            {criterion.current_score} / {criterion.max_weightage} pts
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pb-3">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Score Realization ({scorePercent}%)</span>
            <span>Target: {criterion.target_score} pts</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${scorePercent}%` }}
            />
          </div>
        </div>

        {/* Lead Evaluator info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-border/50">
          <UserCheck className="w-4 h-4 text-primary shrink-0" />
          <span className="truncate">
            <strong className="text-foreground">Lead:</strong> {criterion.lead_evaluator}
          </span>
        </div>

        {/* Key Indicators Collapsible */}
        <div>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between text-xs font-semibold text-primary hover:underline py-1"
          >
            <span>
              {criterion.key_indicators.length} Key Quality Indicators (QnM & QlM)
            </span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expanded && (
            <div className="space-y-2 mt-2 pt-2 border-t border-border/60">
              {criterion.key_indicators.map((ind) => (
                <div
                  key={ind.id}
                  className="p-2.5 rounded-md bg-background/80 border border-border/70 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-foreground">
                      Metric {ind.metricCode} ({ind.type === "quantitative" ? "QnM" : "QlM"})
                    </span>
                    {ind.documentationVerified && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> DVV Verified
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{ind.description}</p>
                  <div className="flex items-center justify-between font-mono text-[11px] pt-1 border-t border-border/40">
                    <span className="text-muted-foreground">Target: {ind.benchmarkTarget} {ind.unit}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      Achieved: {ind.achievedScore} {ind.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-3 border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground">
        <span className="flex items-center gap-1 font-mono text-[11px]">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          {criterion.last_audited_at
            ? new Date(criterion.last_audited_at).toLocaleDateString()
            : "Audited"}
        </span>
        {onUpdateScore && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => onUpdateScore(criterion)}
          >
            Calibrate Score
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
