"use client";

import React, { useState } from "react";
import { NbaSarDossier } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Calendar,
  CheckCircle2,
  Lock,
  Layers,
} from "lucide-react";

interface SarDossierCardProps {
  dossier: NbaSarDossier;
  onVerify?: (dossier: NbaSarDossier) => void;
}

export function SarDossierCard({ dossier, onVerify }: SarDossierCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accredited":
        return {
          label: "Accreditation Granted",
          color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
        };
      case "submitted_to_nba":
        return {
          label: "Submitted to NBA Expert Council",
          color: "bg-blue-500/10 text-blue-600 border-blue-500/30",
        };
      case "academic_council_approved":
        return {
          label: "Academic Council Approved",
          color: "bg-purple-500/10 text-purple-600 border-purple-500/30",
        };
      default:
        return {
          label: "Internal Peer Review",
          color: "bg-amber-500/10 text-amber-600 border-amber-500/30",
        };
    }
  };

  const statusInfo = getStatusBadge(dossier.status);

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-border/80 bg-card">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="outline" className="font-mono font-bold bg-primary/10 text-primary border-primary/30">
            {dossier.sar_code}
          </Badge>
          <Badge variant="outline" className={`font-semibold text-xs ${statusInfo.color}`}>
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            {statusInfo.label}
          </Badge>
        </div>

        <CardTitle className="text-base font-bold text-foreground mt-2 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary shrink-0" />
          {dossier.program_name || dossier.program_code}
        </CardTitle>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-0.5">
          <span>Academic Year: <strong className="text-foreground">{dossier.academic_year}</strong></span>
          <span>•</span>
          <span>Tier: <strong className="text-foreground">Washington Accord Tier-1</strong></span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        <div className="bg-muted/40 p-3 rounded-lg border border-border/50">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs text-muted-foreground block">Evaluation Score (10 Criteria):</span>
              <div className="text-xl font-black text-foreground">
                {dossier.total_eval_points.toFixed(1)}{" "}
                <span className="text-xs font-normal text-muted-foreground">/ 1000 pts</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1 justify-end">
                <Lock className="w-3 h-3 text-primary" /> Seal Hash:
              </span>
              <code className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
                {dossier.verification_hash.slice(0, 18)}...
              </code>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground flex items-center justify-between">
          <span className="flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-primary" /> Coordinator:{" "}
            <strong className="text-foreground">{dossier.coordinator_name}</strong>
          </span>
          {dossier.submission_date && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-primary" /> Filed: {dossier.submission_date}
            </span>
          )}
        </div>

        {dossier.evaluator_remarks && (
          <p className="text-xs text-muted-foreground border-l-2 border-primary/50 pl-2 py-0.5 italic">
            &ldquo;{dossier.evaluator_remarks}&rdquo;
          </p>
        )}

        {expanded && dossier.criteria_progress && (
          <div className="pt-3 border-t border-border/60 space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3 h-3" /> Tier-1 Evaluation Criteria ({dossier.criteria_progress.length})
            </h4>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {dossier.criteria_progress.map((crit) => (
                <div
                  key={crit.criterionNumber}
                  className="p-2 rounded bg-background border border-border/50 text-xs flex justify-between items-center"
                >
                  <div className="pr-2">
                    <span className="font-semibold text-foreground">
                      C{crit.criterionNumber}: {crit.name}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-primary">
                      {crit.awardedMarks} / {crit.maxMarks}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex justify-between gap-2 border-t border-border/40 py-2.5">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs w-full text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              Hide Criteria Breakdown <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              View 10 NBA Criteria <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
