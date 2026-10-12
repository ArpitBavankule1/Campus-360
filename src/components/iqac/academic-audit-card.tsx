"use client";

import React from "react";
import { IqacAcademicAudit } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  Calendar,
  Building2,
  UserCheck,
  FileSearch,
  AlertCircle,
} from "lucide-react";

interface AcademicAuditCardProps {
  audit: IqacAcademicAudit;
  onVerify?: (code: string) => void;
}

export function AcademicAuditCard({ audit, onVerify }: AcademicAuditCardProps) {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "academic":
        return { label: "Academic Audit", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30" };
      case "administrative":
        return { label: "Admin Audit", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30" };
      case "green_energy":
        return { label: "Green Energy & Eco Audit", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" };
      case "gender_equity":
        return { label: "Gender Equity Audit", color: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30" };
      case "financial_compliance":
        return { label: "Financial Compliance", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30" };
      default:
        return { label: type, color: "bg-muted text-muted-foreground" };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return {
          label: "Completed & Filed",
          color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        };
      case "atr_pending":
        return {
          label: "ATR Pending",
          color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
          icon: <AlertCircle className="w-3.5 h-3.5" />,
        };
      case "in_inspection":
        return {
          label: "On-Site Inspection",
          color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
          icon: <FileSearch className="w-3.5 h-3.5" />,
        };
      case "scheduled":
      default:
        return {
          label: "Scheduled",
          color: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30",
          icon: <Clock className="w-3.5 h-3.5" />,
        };
    }
  };

  const typeInfo = getTypeBadge(audit.audit_type);
  const statusInfo = getStatusBadge(audit.audit_status);

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-border/80">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="outline" className={`font-mono text-xs ${typeInfo.color}`}>
            {typeInfo.label}
          </Badge>
          <Badge variant="outline" className={`font-medium text-xs flex items-center gap-1 ${statusInfo.color}`}>
            {statusInfo.icon}
            {statusInfo.label}
          </Badge>
        </div>
        <CardTitle className="text-base font-bold mt-2 text-foreground flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary shrink-0" />
          <span>{audit.audit_title}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 pb-3 text-xs">
        {/* Audit code & department */}
        <div className="flex items-center justify-between p-2 rounded-md bg-muted/50 border border-border/60">
          <span className="font-mono text-muted-foreground">{audit.audit_code}</span>
          <span className="font-semibold text-foreground truncate max-w-[200px]">
            {audit.target_department}
          </span>
        </div>

        {/* Lead external reviewer */}
        <div className="p-2.5 rounded-lg bg-background/80 border border-border/60 space-y-1">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <UserCheck className="w-3.5 h-3.5 text-primary" />
            <span>Lead External Auditor:</span>
          </div>
          <p className="text-muted-foreground pl-5">{audit.lead_external_auditor}</p>
          <p className="text-[11px] text-muted-foreground/80 pl-5 italic">
            Affiliation: {audit.external_auditor_affiliation}
          </p>
        </div>

        {/* Observations snippet */}
        {audit.key_observations && audit.key_observations.length > 0 && (
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground">
              Audit Observations:
            </span>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-1 text-[11px]">
              {audit.key_observations.map((obs, idx) => (
                <li key={idx} className="leading-snug">
                  {obs}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Taken Report (ATR) */}
        {audit.action_taken_report && (
          <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[11px] space-y-0.5">
            <span className="font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Action Taken Report (ATR):
            </span>
            <p className="pl-4 leading-relaxed">{audit.action_taken_report}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 pb-3 border-t border-border/50 flex justify-between items-center text-xs">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <span>Scheduled: {audit.scheduled_date}</span>
        </div>
        <div className="flex items-center gap-2">
          {audit.overall_compliance_score > 0 && (
            <Badge variant="secondary" className="font-mono text-xs font-semibold">
              {audit.overall_compliance_score}% Compliance
            </Badge>
          )}
          {onVerify && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={() => onVerify(audit.audit_code)}
            >
              Verify
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
