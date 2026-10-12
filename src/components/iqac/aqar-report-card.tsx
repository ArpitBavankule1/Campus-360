"use client";

import React from "react";
import { IqacAqarReport } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Download,
  Award,
  Calendar,
  Send,
  Building,
} from "lucide-react";

interface AqarReportCardProps {
  report: IqacAqarReport;
  onVerify?: (token: string) => void;
}

export function AqarReportCard({ report, onVerify }: AqarReportCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted_naac":
        return {
          label: "Submitted to NAAC",
          color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        };
      case "executive_approved":
        return {
          label: "Executive Approved",
          color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
          icon: <ShieldCheck className="w-3.5 h-3.5" />,
        };
      case "peer_review":
        return {
          label: "Peer Review Active",
          color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
          icon: <Clock className="w-3.5 h-3.5" />,
        };
      case "draft":
      default:
        return {
          label: "Internal Draft",
          color: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30",
          icon: <FileText className="w-3.5 h-3.5" />,
        };
    }
  };

  const statusInfo = getStatusBadge(report.aqar_status);

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-border/80">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline" className={`font-medium text-xs flex items-center gap-1 ${statusInfo.color}`}>
            {statusInfo.icon}
            {statusInfo.label}
          </Badge>
          <Badge className="bg-primary/90 text-primary-foreground font-mono text-xs font-bold">
            Grade {report.projected_naac_grade} ({report.overall_cgpa_projected} CGPA)
          </Badge>
        </div>
        <CardTitle className="text-base font-bold mt-2 text-foreground flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary shrink-0" />
          <span>AQAR Docket — AY {report.academic_year}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 pb-3 text-xs">
        {/* Token banner */}
        <div className="flex items-center justify-between p-2 rounded-md bg-muted/50 border border-border/60 font-mono">
          <span className="text-muted-foreground">Submission Token:</span>
          <span className="font-bold text-primary">{report.submission_token}</span>
        </div>

        {/* Director and Approver */}
        <div className="space-y-1.5 text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>IQAC Director:</span>
            <span className="font-medium text-foreground">{report.iqac_director}</span>
          </div>
          {report.executive_signoff_by && (
            <div className="flex items-center justify-between">
              <span>Executive Sign-off:</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {report.executive_signoff_by}
              </span>
            </div>
          )}
          {report.executive_signoff_date && (
            <div className="flex items-center justify-between text-[11px]">
              <span>Sign-off Date:</span>
              <span className="font-mono">
                {new Date(report.executive_signoff_date).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Criteria summary badge cloud if present */}
        {report.criteria_summary && Object.keys(report.criteria_summary).length > 0 && (
          <div className="pt-2 border-t border-border/50">
            <span className="text-[11px] font-semibold text-muted-foreground mb-1 block">
              7 Criteria Score Summary:
            </span>
            <div className="grid grid-cols-4 gap-1 text-[10px] font-mono">
              {Object.entries(report.criteria_summary).map(([k, v]) => (
                <div key={k} className="p-1 rounded bg-background border border-border/60 text-center">
                  <span className="text-muted-foreground">{k.replace("CRITERION_", "C")}</span>:{" "}
                  <span className="font-bold text-foreground">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 pb-3 border-t border-border/50 flex justify-between items-center text-xs">
        {onVerify && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => onVerify(report.submission_token)}
          >
            Verify Docket
          </Button>
        )}
        <Button
          size="sm"
          variant="secondary"
          className="h-7 text-xs flex items-center gap-1"
          onClick={() => {
            alert(`Downloading verified AQAR Report for AY ${report.academic_year} (${report.submission_token})`);
          }}
        >
          <Download className="w-3.5 h-3.5" /> PDF Dossier
        </Button>
      </CardFooter>
    </Card>
  );
}
