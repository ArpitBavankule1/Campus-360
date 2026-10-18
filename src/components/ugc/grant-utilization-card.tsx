"use client";

import React from "react";
import { UgcGrantUtilization } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Banknote,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileSpreadsheet,
} from "lucide-react";

interface GrantUtilizationCardProps {
  grant: UgcGrantUtilization;
}

export function GrantUtilizationCard({ grant }: GrantUtilizationCardProps) {
  const formatInr = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const utilizationPct =
    grant.sanctioned_amount_inr > 0
      ? Math.round((grant.utilized_amount_inr / grant.sanctioned_amount_inr) * 100)
      : 0;

  const getUcStatusBadge = (status: string) => {
    switch (status) {
      case "uc_audited_submitted":
        return {
          label: "Audited UC Submitted to UGC",
          color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
          icon: CheckCircle2,
        };
      case "uc_under_audit":
        return {
          label: "Statutory CA Audit Underway",
          color: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
          icon: Clock,
        };
      case "partially_utilized":
        return {
          label: "Active Grant / Utilization Ongoing",
          color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
          icon: Clock,
        };
      default:
        return {
          label: "Sanctioned",
          color: "bg-muted text-muted-foreground border-border",
          icon: Banknote,
        };
    }
  };

  const ucBadge = getUcStatusBadge(grant.uc_status);
  const StatusIcon = ucBadge.icon;

  return (
    <Card className="overflow-hidden border-border/80 bg-card/60 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-md">
      <CardContent className="p-4 space-y-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <Badge variant="outline" className={`text-[10px] font-medium ${ucBadge.color}`}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {ucBadge.label}
            </Badge>
            <h4 className="text-sm font-semibold text-foreground pt-0.5">{grant.grant_scheme}</h4>
          </div>

          <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary shrink-0">
            FY {grant.financial_year}
          </Badge>
        </div>

        {/* Financial Allocations */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-muted/40 border border-border/50">
            <span className="text-[10px] text-muted-foreground block">Sanctioned</span>
            <span className="font-bold text-foreground">{formatInr(grant.sanctioned_amount_inr)}</span>
          </div>

          <div className="p-2 rounded-lg bg-muted/40 border border-border/50">
            <span className="text-[10px] text-muted-foreground block">Released</span>
            <span className="font-bold text-primary">{formatInr(grant.released_amount_inr)}</span>
          </div>

          <div className="p-2 rounded-lg bg-muted/40 border border-border/50">
            <span className="text-[10px] text-muted-foreground block">Utilized ({utilizationPct}%)</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {formatInr(grant.utilized_amount_inr)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Utilization Rate</span>
            <span className="font-semibold text-foreground">{utilizationPct}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${Math.min(utilizationPct, 100)}%` }}
            />
          </div>
        </div>

        {/* Chartered Accountant Audit Details */}
        <div className="p-2.5 rounded-lg bg-muted/30 border border-border/40 space-y-1 text-xs">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-muted-foreground">Statutory CA Audit UDIN:</span>
            <span className="font-mono font-medium text-foreground">{grant.chartered_accountant_audit_no}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-muted-foreground">UGC UC Certificate Token:</span>
            <span className="font-mono font-bold text-primary">{grant.uc_certificate_token}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
