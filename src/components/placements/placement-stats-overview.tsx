"use client";

import React from "react";
import { InstitutionalPlacementStats } from "@/types";
import {
  TrendingUp,
  Award,
  Users,
  Building2,
  PieChart,
  Briefcase,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface PlacementStatsOverviewProps {
  stats: InstitutionalPlacementStats;
}

export function PlacementStatsOverview({ stats }: PlacementStatsOverviewProps) {
  return (
    <div className="space-y-6">
      {/* 4 Key Stat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-emerald-500/10 via-card to-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Highest Package
            </span>
            <Award className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-foreground mt-2">
            ₹{stats.highestCtcLpa} <span className="text-sm font-bold text-muted-foreground">LPA</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Offered by Google Cloud</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-blue-500/10 via-card to-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Average Package
            </span>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-foreground mt-2">
            ₹{stats.averageCtcLpa} <span className="text-sm font-bold text-muted-foreground">LPA</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Median: ₹{stats.medianCtcLpa} LPA</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-purple-500/10 via-card to-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              Placement Rate
            </span>
            <CheckCircle2 className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-black text-foreground mt-2">
            {stats.overallPlacementRate}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.uniqueStudentsPlaced} of {stats.totalStudentsEligible} eligible placed
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-amber-500/10 via-card to-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Offers & Recruiters
            </span>
            <Building2 className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-foreground mt-2">
            {stats.totalOffersMade} <span className="text-sm font-bold text-muted-foreground">Offers</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Across {stats.totalParticipatingCompanies} global companies
          </p>
        </div>
      </div>

      {/* Department Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <PieChart className="w-5 h-5 text-primary" />
            Branch-Wise Placement Performance
          </h3>

          <div className="space-y-4 pt-1">
            {stats.departmentStats.map((dept) => (
              <div key={dept.department} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-foreground font-semibold">{dept.department}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">Avg: ₹{dept.avgCtcLpa} LPA</span>
                    <span className="font-bold text-primary">{dept.placementPercentage}% Placed</span>
                  </div>
                </div>
                <div className="w-full h-2.5 rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-500"
                    style={{ width: `${dept.placementPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>
                    {dept.totalPlaced} placed out of {dept.totalEligible} candidates
                  </span>
                  <span>Highest: ₹{dept.highestCtcLpa} LPA</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Recruiters Sidebar Card */}
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Top Hiring Partners
          </h3>

          <div className="space-y-3">
            {stats.topRecruiters.map((rec) => (
              <div
                key={rec.company}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/30 hover:border-primary/30 transition-colors"
              >
                <div>
                  <h4 className="text-sm font-bold text-foreground">{rec.company}</h4>
                  <span className="text-xs text-muted-foreground">Max: ₹{rec.maxCtc} LPA</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                    {rec.offersCount} Offers
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
