"use client";

import React from "react";
import { IicNispPolicy } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  DollarSign,
  GraduationCap,
  Scale,
  ShieldAlert,
  CheckCircle2,
  BookmarkCheck,
} from "lucide-react";

interface NispPolicyCardProps {
  policy: IicNispPolicy;
}

export function NispPolicyCard({ policy }: NispPolicyCardProps) {
  return (
    <Card className="overflow-hidden border border-border/60 hover:border-primary/40 hover:shadow-md transition-all duration-200 bg-card">
      <CardContent className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <Badge
            variant="outline"
            className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
          >
            {policy.policy_dimension}
          </Badge>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary font-mono">
              {policy.budget_percentage}% Budget Target
            </span>
            <Badge
              variant="outline"
              className="text-[10px] uppercase font-mono tracking-wider bg-primary/10 text-primary border-primary/20"
            >
              Enacted
            </Badge>
          </div>
        </div>

        <h3 className="text-base font-bold text-foreground leading-snug tracking-tight mb-2">
          {policy.clause_title}
        </h3>

        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
          {policy.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-lg bg-muted/40 text-xs">
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-mono">
              Institutional Target & Outlay
            </span>
            <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              ₹{(policy.budget_allocated_inr / 100000).toFixed(1)} Lakhs ({policy.budget_percentage}%)
            </span>
            <span className="text-[11px] text-muted-foreground mt-0.5 block">
              {policy.institutional_target}
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-mono">
              Equity & Commercial Sharing
            </span>
            <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
              <Scale className="w-3.5 h-3.5 text-amber-500" />
              {policy.equity_sharing_slab}
            </span>
            <span className="text-[11px] text-muted-foreground mt-0.5 block truncate">
              {policy.ip_ownership_terms}
            </span>
          </div>
        </div>

        <div className="mt-3 p-2.5 rounded-lg border border-border/40 bg-card/60 text-xs">
          <div className="flex items-start gap-2 text-muted-foreground">
            <GraduationCap className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground font-medium">Academic Incentive: </strong>
              <span className="text-muted-foreground">{policy.academic_incentives}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/40 text-xs">
          <span className="font-mono text-[11px] text-muted-foreground">
            Res: <strong className="text-primary font-bold">{policy.policy_resolution_token}</strong>
          </span>
          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Academic Council Ratified
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
