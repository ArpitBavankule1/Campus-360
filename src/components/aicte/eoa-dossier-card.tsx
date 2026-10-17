"use client";

import React from "react";
import { AicteEoaDossier } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileCheck,
  CheckCircle2,
  Clock,
  Download,
  Hash,
  ShieldCheck,
  Calendar,
} from "lucide-react";

interface EoaDossierCardProps {
  dossier: AicteEoaDossier;
  onViewDisclosure?: (dossier: AicteEoaDossier) => void;
}

export function EoaDossierCard({ dossier, onViewDisclosure }: EoaDossierCardProps) {
  const getInspectionBadge = (status: string) => {
    switch (status) {
      case "recommended":
        return {
          label: "EVC Inspection Cleared (Recommended)",
          color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
          icon: CheckCircle2,
        };
      case "scrutiny_cleared":
        return {
          label: "Scrutiny Cleared (Zero Deficiency)",
          color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
          icon: CheckCircle2,
        };
      default:
        return {
          label: "Under Scrutiny",
          color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
          icon: Clock,
        };
    }
  };

  const insp = getInspectionBadge(dossier.evc_inspection_status);
  const InspIcon = insp.icon;

  return (
    <Card className="overflow-hidden border-border/80 bg-card/60 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-md">
      <CardContent className="p-4 space-y-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                {dossier.academic_year}
              </span>
              <span className="text-sm font-semibold text-foreground">
                Application: {dossier.application_number}
              </span>
            </div>
          </div>

          <Badge variant="outline" className={`text-[10px] gap-1 font-medium ${insp.color}`}>
            <InspIcon className="h-3 w-3" />
            {insp.label}
          </Badge>
        </div>

        {/* Deficiency & Scrutiny Details */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-muted/40 border border-border/50 text-xs">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase font-medium">Deficiency Index</div>
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              {dossier.deficiency_index.toFixed(1)}% <span className="text-[10px] font-normal text-muted-foreground">(Clean)</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-muted-foreground uppercase font-medium">Submission Date</div>
            <div className="text-xs font-mono font-medium text-foreground pt-1 flex items-center justify-end gap-1">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              {dossier.submission_date}
            </div>
          </div>
        </div>

        {/* Cryptographic Digital Signature */}
        <div className="p-2 rounded-md bg-background/60 border border-border/40 text-[10px] font-mono text-muted-foreground truncate">
          <span className="font-bold text-foreground">Digital Sig:</span> {dossier.digital_signature_hash}
        </div>

        {/* Action button */}
        <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs">
          <span className="font-mono text-[10px] text-primary">
            Docket: {dossier.eoa_docket_token}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDisclosure?.(dossier)}
            className="text-xs gap-1.5 h-7 px-2.5 border-primary/30 text-primary hover:bg-primary/10"
          >
            <FileCheck className="h-3.5 w-3.5" />
            Mandatory Disclosure
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
