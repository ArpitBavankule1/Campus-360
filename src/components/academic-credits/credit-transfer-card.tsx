"use client";

import React from "react";
import { CreditTransferApplication } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Building2,
  Percent,
} from "lucide-react";

interface CreditTransferCardProps {
  transfer: CreditTransferApplication;
  onApprove?: (transfer: CreditTransferApplication) => void;
  onReject?: (transfer: CreditTransferApplication) => void;
}

export function CreditTransferCard({
  transfer,
  onApprove,
  onReject,
}: CreditTransferCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved_by_dean":
        return {
          label: "Dean Approved & Transferred",
          color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
          icon: CheckCircle2,
        };
      case "under_scrutiny":
        return {
          label: "Under BOS Committee Review",
          color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
          icon: Clock,
        };
      case "rejected":
        return {
          label: "Equivalence Rejected",
          color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
          icon: XCircle,
        };
      default:
        return {
          label: "Application Submitted",
          color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
          icon: Clock,
        };
    }
  };

  const st = getStatusBadge(transfer.evaluation_status);
  const StatusIcon = st.icon;

  return (
    <Card className="border-border/80 bg-card/60 backdrop-blur-sm overflow-hidden transition-all hover:border-primary/40 hover:shadow-md">
      <CardContent className="p-4 space-y-3.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-foreground">{transfer.student_name}</span>
              <span className="text-xs font-mono text-muted-foreground">({transfer.apaar_id})</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
              <Building2 className="h-3.5 w-3.5" />
              <span>Source: {transfer.source_institution}</span>
            </div>
          </div>

          <Badge variant="outline" className={`text-[11px] gap-1 font-medium ${st.color}`}>
            <StatusIcon className="h-3 w-3" />
            {st.label}
          </Badge>
        </div>

        {/* Equivalence Mapping box */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 p-3 rounded-lg bg-muted/40 border border-border/50 items-center text-xs">
          <div className="md:col-span-3 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-medium">Source Course</span>
            <div className="font-medium text-foreground">{transfer.course_name}</div>
            <div className="text-[11px] font-mono text-primary">
              {transfer.course_code} • {transfer.credits_claimed} Credits
            </div>
          </div>

          <div className="md:col-span-1 flex flex-col items-center justify-center py-1">
            <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block" />
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              <Percent className="h-3 w-3" />
              <span>{transfer.equivalence_score}%</span>
            </div>
          </div>

          <div className="md:col-span-3 space-y-0.5 md:text-right">
            <span className="text-[10px] text-muted-foreground uppercase font-medium">Equivalent Campus Course</span>
            <div className="font-medium text-foreground">{transfer.target_equivalent_course_name}</div>
            <div className="text-[11px] font-mono text-primary">
              {transfer.target_equivalent_course_code}
            </div>
          </div>
        </div>

        {/* Remarks & Token */}
        {transfer.scrutiny_remarks && (
          <p className="text-xs text-muted-foreground italic border-l-2 border-primary/50 pl-2.5 py-0.5">
            {transfer.scrutiny_remarks}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-border/40 gap-2">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
            <FileText className="h-3.5 w-3.5" />
            <span>Docket: {transfer.transfer_docket_token}</span>
          </div>

          {transfer.evaluation_status === "submitted" || transfer.evaluation_status === "under_scrutiny" ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReject?.(transfer)}
                className="h-7 px-2.5 text-xs text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
              >
                Reject
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => onApprove?.(transfer)}
                className="h-7 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Approve Transfer
              </Button>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
