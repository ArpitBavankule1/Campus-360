"use client";

import React from "react";
import { NirfDossier } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ShieldCheck,
  Calendar,
  UserCheck,
  TrendingUp,
  Download,
  Copy,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

interface DossierCardProps {
  dossier: NirfDossier;
  onVerify?: (dossier: NirfDossier) => void;
}

export function DossierCard({ dossier, onVerify }: DossierCardProps) {
  const [copied, setCopied] = React.useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(dossier.dossier_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted_to_moe":
        return { label: "Submitted to MoE", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" };
      case "board_approved":
        return { label: "Board Approved", color: "bg-blue-500/10 text-blue-600 border-blue-500/30" };
      case "internal_audit":
        return { label: "Internal Audit", color: "bg-amber-500/10 text-amber-600 border-amber-500/30" };
      case "published":
        return { label: "Published Official", color: "bg-purple-500/10 text-purple-600 border-purple-500/30" };
      default:
        return { label: "Draft Filing", color: "bg-muted text-muted-foreground border-border" };
    }
  };

  const statusInfo = getStatusBadge(dossier.status);

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-border/80 bg-card">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="outline" className={`font-semibold ${statusInfo.color}`}>
            {statusInfo.label}
          </Badge>
          <Badge variant="secondary" className="font-mono text-xs">
            AY {dossier.academic_year}
          </Badge>
        </div>
        <CardTitle className="text-lg font-bold mt-2 flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 text-foreground">
            <FileText className="w-5 h-5 text-primary shrink-0" />
            {dossier.category} Discipline Dossier
          </span>
          <span className="text-xl font-black text-primary">
            {dossier.composite_score.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">pts</span>
          </span>
        </CardTitle>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-mono text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/60">
            {dossier.dossier_code}
          </span>
          <button
            onClick={copyCode}
            className="text-muted-foreground hover:text-foreground text-xs"
            title="Copy Dossier Code"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-1 text-xs">
        <div className="grid grid-cols-2 gap-2 bg-muted/40 p-2.5 rounded-lg border border-border/50">
          <div>
            <span className="text-muted-foreground text-[11px] block">Projected NIRF Rank:</span>
            <span className="font-bold text-foreground text-sm flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" /> {dossier.projected_rank_range}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground text-[11px] block">Previous Year Rank:</span>
            <span className="font-semibold text-muted-foreground text-sm">
              {dossier.previous_year_rank ? `Rank #${dossier.previous_year_rank}` : "New Entry"}
            </span>
          </div>
        </div>

        <div className="space-y-1.5 pt-1 text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>Filer: <strong className="text-foreground">{dossier.submitted_by}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>Authority: <strong className="text-foreground">{dossier.approving_authority}</strong></span>
          </div>
          {dossier.submission_date && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>MoE Submission: {dossier.submission_date}</span>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-border/50">
          <span className="text-[10px] text-muted-foreground font-mono truncate block">
            SHA256 Hash: {dossier.verification_hash}
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex gap-2 border-t border-border/40 py-2.5">
        <Button
          variant="outline"
          size="sm"
          className="text-xs flex-1 gap-1"
          onClick={() => onVerify?.(dossier)}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Verify Compliance
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="text-xs flex-1 gap-1"
          onClick={copyCode}
        >
          <Download className="w-3.5 h-3.5" /> Export Dossier
        </Button>
      </CardFooter>
    </Card>
  );
}
