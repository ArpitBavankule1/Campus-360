"use client";

import React from "react";
import { WorldRankingMetric } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  BookOpen,
  Users,
  Briefcase,
  Globe2,
  Leaf,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

interface MetricBreakdownCardProps {
  metrics: WorldRankingMetric[];
  title?: string;
}

export function MetricBreakdownCard({ metrics, title = "QS & THE Core Performance Metrics" }: MetricBreakdownCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Reputation":
        return <Users className="h-4 w-4 text-purple-500" />;
      case "Research_Citations":
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case "Faculty_Student_Ratio":
        return <Users className="h-4 w-4 text-indigo-500" />;
      case "Internationalization":
        return <Globe2 className="h-4 w-4 text-emerald-500" />;
      case "Employability":
        return <Briefcase className="h-4 w-4 text-amber-500" />;
      case "Sustainability":
        return <Leaf className="h-4 w-4 text-teal-500" />;
      default:
        return <BarChart3 className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <Card className="border-border/80 bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
              <p className="text-xs text-muted-foreground">
                Audited indicators normalized against global research institutions
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            {metrics.length} Indicators
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric) => {
            const score = metric.normalized_score;
            return (
              <div
                key={metric.id}
                className="p-3.5 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(metric.category)}
                    <div>
                      <div className="text-sm font-semibold leading-tight">{metric.metric_name}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                        Weight: {metric.weightage_pct}%
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-base font-bold text-foreground">
                      {score.toFixed(1)}
                      <span className="text-[11px] text-muted-foreground font-normal"> / 100</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 mt-0.5">
                      <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                      {metric.global_percentile.toFixed(1)}th %ile
                    </Badge>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                  />
                </div>

                {/* Audit Source */}
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                  <ShieldCheck className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                  <span className="truncate">{metric.audit_source}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
