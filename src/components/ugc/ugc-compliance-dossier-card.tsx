"use client";

import React from "react";
import { UgcComplianceDossier } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  CheckCircle2,
  Calendar,
  Lock,
  Stamp,
} from "lucide-react";

interface UgcComplianceDossierCardProps {
  dossier: UgcComplianceDossier;
}

export function UgcComplianceDossierCard({ dossier }: UgcComplianceDossierCardProps) {
  const getDossierBadge = (type: string) => {
    switch (type) {
      case "annual_autonomy_return":
        return {
          label: "Annual Autonomy Performance Return",
          color: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
        };
      case "governing_body_minutes":
        return {
          label: "Statutory Governing Body Minutes",
          color: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
        };
      case "ugc_2f_12b_certificate":
        return {
          label: "Section 2(f) & 12(B) Recognition Gazettes",
          color: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
        };
      case "affiliation_endorsement":
        return {
          label: "University Affiliation Endorsement",
          color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
        };
      case "iqac_statutory_action_taken":
        return {
          label: "IQAC Statutory Action Taken Report",
          color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        };
      default:
        return {
          label: "Statutory Filing Dossier",
          color: "bg-muted text-muted-foreground border-border",
        };
    }
  };

  const badge = getDossierBadge(dossier.dossier_type);

  return (
    <Card className="overflow-hidden border-border/80 bg-card/60 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-md">
      <CardContent className="p-4 space-y-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <Badge variant="outline" className={`text-[10px] font-medium ${badge.color}`}>
              {badge.label}
            </Badge>
            <h4 className="text-sm font-semibold text-foreground pt-0.5">{dossier.title}</h4>
          </div>

          <Badge
            variant="outline"
            className="text-[10px] gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shrink-0"
          >
            <CheckCircle2 className="h-3 w-3" />
            Verified & Compliant
          </Badge>
        </div>

        {/* Dossier Meta */}
        <div className="p-3 rounded-lg bg-muted/40 border border-border/50 space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Academic Year:</span>
            <span className="font-semibold text-foreground">{dossier.academic_year}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Submission Date:</span>
            <span className="font-medium text-foreground">{dossier.submission_date}</span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-border/40">
            <span className="text-muted-foreground">UGC Dossier Token:</span>
            <span className="font-mono font-bold text-primary">{dossier.dossier_token}</span>
          </div>
        </div>

        {/* Digital Verification Hash */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40 gap-2">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Stamp className="h-3.5 w-3.5 text-primary" />
            <span>Digital UGC Seal Hash:</span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[190px]" title={dossier.digital_seal_hash}>
            {dossier.digital_seal_hash}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
