"use client";

import React from "react";
import { ScholarshipScheme } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, Award, Calendar, DollarSign, Sparkles, CheckCircle2 } from "lucide-react";

interface ScholarshipSchemeCardProps {
  scheme: ScholarshipScheme;
  onApply: (scheme: ScholarshipScheme) => void;
}

export function ScholarshipSchemeCard({
  scheme,
  onApply,
}: ScholarshipSchemeCardProps) {
  const isOpen = scheme.status === "Applications Open";

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 via-card/50 to-background/80 p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-blue-500/50 hover:shadow-blue-500/10 hover:shadow-xl">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-base tracking-tight leading-tight line-clamp-1">
              {scheme.scheme_name}
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              {scheme.provider_type}
            </span>
          </div>
        </div>
        <Badge
          variant="outline"
          className={
            isOpen
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
              : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
          }
        >
          {scheme.status}
        </Badge>
      </div>

      <div className="space-y-2 py-2 text-xs text-muted-foreground border-y border-border/40 my-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-blue-500" />
            Min. CGPA: <strong className="text-foreground">{scheme.min_cgpa.toFixed(2)}</strong>
          </span>
          <span>
            Income Limit: <strong className="text-foreground">≤ ₹{scheme.max_family_income_lpa} LPA</strong>
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-orange-500" />
            Deadline: <strong className="text-foreground">{scheme.application_deadline}</strong>
          </span>
          <span className="text-[11px] text-emerald-500 font-medium">
            DBT Bank Direct
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xs text-muted-foreground">Grant Award</span>
          <p className="text-sm font-bold text-blue-400">
            ₹{scheme.amount_per_scholar_inr.toLocaleString("en-IN")} / scholar
          </p>
        </div>
        <Button
          size="sm"
          disabled={!isOpen}
          onClick={() => onApply(scheme)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-md shadow-blue-600/20"
        >
          {isOpen ? "Apply Grant" : "Closed"}
        </Button>
      </div>
    </div>
  );
}
