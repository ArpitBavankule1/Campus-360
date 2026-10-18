"use client";

import React from "react";
import { UgcAutonomyReview } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  CheckCircle2,
  Calendar,
  FileCheck,
  Shield,
  ExternalLink,
} from "lucide-react";

interface AutonomyReviewCardProps {
  review: UgcAutonomyReview;
}

export function AutonomyReviewCard({ review }: AutonomyReviewCardProps) {
  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case "unconditional_extension":
        return {
          label: "10-Year Unconditional Autonomous Extension",
          color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        };
      case "extension_recommended":
        return {
          label: "Autonomous Extension Recommended",
          color: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
        };
      case "compliance_pending":
        return {
          label: "Compliance Scrutiny Pending",
          color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
        };
      default:
        return {
          label: "Inspection Scheduled",
          color: "bg-muted text-muted-foreground border-border",
        };
    }
  };

  const outcomeBadge = getOutcomeBadge(review.inspection_outcome);

  return (
    <Card className="overflow-hidden border-border/80 bg-card/60 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-md">
      <CardContent className="p-4 space-y-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <Badge variant="outline" className={`text-[10px] font-medium ${outcomeBadge.color}`}>
              <Award className="mr-1 h-3 w-3" />
              {outcomeBadge.label}
            </Badge>
            <h4 className="text-sm font-semibold text-foreground pt-0.5">{review.autonomy_cycle}</h4>
          </div>

          <Badge
            variant="outline"
            className="text-[10px] gap-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 shrink-0"
          >
            <Shield className="h-3 w-3" />
            UGC 2(f) & 12(B) Recognized
          </Badge>
        </div>

        {/* UGC Conferment Details */}
        <div className="p-3 rounded-lg bg-muted/40 border border-border/50 space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">UGC Gazette / Letter No:</span>
            <span className="font-mono font-semibold text-primary">{review.ugc_conferment_letter_no}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Autonomy Validity Window:</span>
            <span className="font-bold text-foreground">
              {review.validity_start_year} – {review.validity_end_year} ({review.validity_end_year - review.validity_start_year} Years)
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Expert Peer Team Visit Date:</span>
            <span className="font-medium text-foreground">{review.expert_committee_visit_date}</span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-border/40">
            <span className="text-muted-foreground">NAAC Score Multiplier:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              CGPA {review.naac_score_multiplier} / 4.0 (A++ Grade)
            </span>
          </div>
        </div>

        {/* Tokens & Verification Hash */}
        <div className="space-y-1 text-xs pt-1 border-t border-border/40">
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-muted-foreground">Annual Compliance Report (ACR):</span>
            <span className="font-mono text-[10px] font-semibold text-foreground">{review.annual_compliance_report_token}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-muted-foreground">Dossier Hash:</span>
            <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[200px]" title={review.autonomy_dossier_hash}>
              {review.autonomy_dossier_hash}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
