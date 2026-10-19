"use client";

import React from "react";
import { IicAriiaRanking, IicPerformanceRating } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Star,
  Award,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Building2,
  FileCheck2,
} from "lucide-react";

interface AriiaPerformanceCardProps {
  ariia: IicAriiaRanking;
  performance: IicPerformanceRating;
}

export function AriiaPerformanceCard({
  ariia,
  performance,
}: AriiaPerformanceCardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* 5-Star MoE MIC Rating Card */}
      <Card className="overflow-hidden border border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-card to-background shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Badge
              variant="outline"
              className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              MoE Innovation Cell (MIC) Rating
            </Badge>
            <span className="font-mono text-xs text-muted-foreground">
              {performance.academic_year}
            </span>
          </div>

          <div className="flex items-center gap-3 my-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-7 h-7 ${
                    i < performance.star_rating
                      ? "text-amber-500 fill-amber-500 drop-shadow"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-2xl font-extrabold text-foreground tracking-tight">
              5 Stars
            </span>
            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs">
              Highest National Tier
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Conferred by the Ministry of Education&apos;s Innovation Cell (MIC), Government of
            India, for exceptional institutional performance across all 4 mandatory activity quarters.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-4 p-3 rounded-lg bg-card/80 border border-border/40 text-xs">
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-mono">
                Cumulative Points
              </span>
              <span className="text-base font-bold text-foreground">
                {performance.cumulative_points} / 100.0
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-mono">
                National Percentile
              </span>
              <span className="text-base font-bold text-primary">
                Top {performance.national_percentile}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/40 text-xs">
            <span className="font-mono text-[11px] text-muted-foreground">
              Certificate: <strong className="text-primary">{performance.annual_certificate_token}</strong>
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              Verified by MIC
            </span>
          </div>
        </CardContent>
      </Card>

      {/* ARIIA / NIRF Innovation Ranking Card */}
      <Card className="overflow-hidden border border-primary/40 bg-gradient-to-br from-primary/10 via-card to-background shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Badge
              variant="outline"
              className="text-xs font-bold px-3 py-1 rounded-full bg-primary/20 text-primary border-primary/30 flex items-center gap-1.5"
            >
              <Trophy className="w-3.5 h-3.5" />
              ARIIA / NIRF Innovation
            </Badge>
            <span className="font-mono text-xs text-muted-foreground">
              {ariia.ranking_year}
            </span>
          </div>

          <div className="my-2">
            <h3 className="text-2xl font-extrabold text-foreground tracking-tight">
              {ariia.rank_band}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Composite Institutional Innovation Score:{" "}
              <strong className="text-primary font-bold text-sm">
                {ariia.total_score} / 100.0
              </strong>
            </p>
          </div>

          <div className="space-y-2 mt-4 text-xs">
            <div>
              <div className="flex justify-between text-muted-foreground mb-1 text-[11px]">
                <span>Mindset & Culture Development</span>
                <span className="font-semibold text-foreground">{ariia.mindset_development_score}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full"
                  style={{ width: `${ariia.mindset_development_score}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-muted-foreground mb-1 text-[11px]">
                <span>Pre-Incubation & Incubation Infrastructure</span>
                <span className="font-semibold text-foreground">{ariia.infrastructure_facilities_score}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{ width: `${ariia.infrastructure_facilities_score}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-muted-foreground mb-1 text-[11px]">
                <span>Patents & Commercialization Outlays</span>
                <span className="font-semibold text-foreground">{ariia.patents_and_commercialization_score}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-1.5 rounded-full"
                  style={{ width: `${ariia.patents_and_commercialization_score}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/40 text-xs">
            <span className="font-mono text-[11px] text-muted-foreground">
              Dossier: <strong className="text-primary">{ariia.annual_dossier_token}</strong>
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Band 1 Confirmed
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
