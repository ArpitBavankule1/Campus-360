"use client";

import React, { useState } from "react";
import { NirfParameterMetric } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Award,
  ChevronDown,
  ChevronUp,
  UserCheck,
  TrendingUp,
  Target,
  BarChart3,
  Layers,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface ParameterScoreCardProps {
  parameter: NirfParameterMetric;
  onUpdateScore?: (parameter: NirfParameterMetric) => void;
}

export function ParameterScoreCard({
  parameter,
  onUpdateScore,
}: ParameterScoreCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getParameterBadge = (code: string) => {
    switch (code) {
      case "TLR":
        return {
          label: "TLR: Teaching & Resources",
          color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
          weight: "30% Weightage",
        };
      case "RPC":
        return {
          label: "RPC: Research & Publications",
          color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
          weight: "30% Weightage",
        };
      case "GO":
        return {
          label: "GO: Graduation Outcomes",
          color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
          weight: "20% Weightage",
        };
      case "OI":
        return {
          label: "OI: Outreach & Inclusivity",
          color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
          weight: "10% Weightage",
        };
      case "PR":
        return {
          label: "PR: Perception Survey",
          color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
          weight: "10% Weightage",
        };
      default:
        return {
          label: code,
          color: "bg-muted text-muted-foreground border-border",
          weight: "Standard",
        };
    }
  };

  const badgeInfo = getParameterBadge(parameter.code);
  const scorePercent = Math.min(
    100,
    Math.round((parameter.current_score / parameter.max_weightage) * 100)
  );

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-border/80 bg-card">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="outline" className={`font-semibold ${badgeInfo.color}`}>
            {badgeInfo.label}
          </Badge>
          <div className="flex items-center gap-1.5">
            <Badge variant="secondary" className="text-xs">
              {badgeInfo.weight}
            </Badge>
            {parameter.status === "verified" ? (
              <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Audited
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/30 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {parameter.status.replace("_", " ")}
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="text-lg font-bold mt-2 text-foreground flex items-center gap-2">
          <Award className="w-5 h-5 text-primary shrink-0" />
          {parameter.name}
        </CardTitle>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
          {parameter.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        <div className="bg-muted/40 p-3 rounded-lg border border-border/50">
          <div className="flex justify-between items-end mb-1.5">
            <div>
              <span className="text-xs text-muted-foreground">Score Achieved:</span>
              <div className="text-2xl font-black text-foreground">
                {parameter.current_score.toFixed(1)}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  / {parameter.max_weightage}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                <TrendingUp className="w-3 h-3 text-emerald-500" /> Projected:
              </span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {parameter.projected_score.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden mt-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${scorePercent}%` }}
            />
          </div>
        </div>

        <div className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
          <UserCheck className="w-3.5 h-3.5 text-primary" />
          <span>Lead: <strong className="text-foreground">{parameter.lead_coordinator}</strong></span>
        </div>

        {/* Sub-Metrics Section */}
        {expanded && parameter.sub_metrics && parameter.sub_metrics.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-border/60">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3 h-3" /> Core Sub-Parameters ({parameter.sub_metrics.length})
            </h4>
            <div className="space-y-2">
              {parameter.sub_metrics.map((sub, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-md bg-background border border-border/60 text-xs space-y-1"
                >
                  <div className="flex justify-between font-medium">
                    <span className="text-foreground font-semibold">
                      [{sub.code}] {sub.title}
                    </span>
                    <span className="text-primary font-bold">
                      {sub.achievedScore} / {sub.maxScore}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-[11px]">
                    <span>Target: {sub.benchmarkValue}</span>
                    <span className="font-medium text-foreground">Actual: {sub.actualValue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex justify-between gap-2 border-t border-border/40 py-2.5">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs w-full text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              Hide Sub-Metrics <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              View Sub-Metrics ({parameter.sub_metrics?.length || 0}){" "}
              <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
