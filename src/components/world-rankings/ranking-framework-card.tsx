"use client";

import React from "react";
import { WorldRankingFramework } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  TrendingUp,
  Award,
  ExternalLink,
  UserCheck,
  CheckCircle2,
  Calendar,
} from "lucide-react";

interface RankingFrameworkCardProps {
  framework: WorldRankingFramework;
  onSelect?: (framework: WorldRankingFramework) => void;
}

export function RankingFrameworkCard({ framework, onSelect }: RankingFrameworkCardProps) {
  const getTrajectoryBadge = (trajectory: string) => {
    switch (trajectory) {
      case "improved":
        return {
          label: "Rank Improved",
          color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
          icon: TrendingUp,
        };
      case "retained":
        return {
          label: "Rank Retained",
          color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
          icon: CheckCircle2,
        };
      default:
        return {
          label: "Benchmark Active",
          color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
          icon: Award,
        };
    }
  };

  const trajectory = getTrajectoryBadge(framework.rank_trajectory);
  const TrajectoryIcon = trajectory.icon;

  return (
    <Card
      onClick={() => onSelect?.(framework)}
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50 cursor-pointer border-border/80 bg-card/60 backdrop-blur-sm"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-80" />

      <CardHeader className="pb-3 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold leading-tight group-hover:text-primary transition-colors">
                {framework.framework_name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs font-mono font-medium">
                  {framework.framework_code}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Edition {framework.edition_year}
                </span>
              </div>
            </div>
          </div>
          <Badge className={`text-xs px-2.5 py-0.5 border flex items-center gap-1 ${trajectory.color}`}>
            <TrajectoryIcon className="h-3 w-3" />
            {trajectory.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Rank Display Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border border-primary/20 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Global Standing
            </div>
            <div className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
              {framework.overall_rank_display}
            </div>
            {framework.previous_year_rank && (
              <div className="text-xs text-muted-foreground mt-0.5">
                Previous: <span className="font-medium text-foreground">{framework.previous_year_rank}</span>
              </div>
            )}
          </div>

          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Composite Score
            </div>
            <div className="text-2xl font-black text-primary mt-0.5">
              {framework.overall_score}
              <span className="text-xs text-muted-foreground font-normal"> / 100</span>
            </div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
              National Rank #{framework.national_rank}
            </div>
          </div>
        </div>

        {/* Lead Coordinator */}
        <div className="pt-1 flex items-center justify-between text-xs border-t border-border/50 text-muted-foreground">
          <div className="flex items-center gap-1.5 truncate max-w-[260px]">
            <UserCheck className="h-3.5 w-3.5 text-primary flex-shrink-0" />
            <span className="truncate">{framework.coordinator_name}</span>
          </div>

          {framework.methodology_url && (
            <a
              href={framework.methodology_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-primary hover:underline font-medium ml-2 flex-shrink-0"
            >
              Methodology
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
