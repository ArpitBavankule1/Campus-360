"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AicteEoaDossier } from "@/types";
import {
  FileCheck,
  CheckCircle2,
  Download,
  ShieldCheck,
  Building2,
  Users,
  Award,
} from "lucide-react";

interface MandatoryDisclosureModalProps {
  dossier: AicteEoaDossier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MandatoryDisclosureModal({
  dossier,
  open,
  onOpenChange,
}: MandatoryDisclosureModalProps) {
  const [downloading, setDownloading] = useState(false);

  if (!dossier) return null;

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Mandatory Disclosure Docket (${dossier.mandatory_disclosure_token}) downloaded.`);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border/80 bg-card/95 backdrop-blur-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <ShieldCheck className="h-4 w-4" />
            <span>AICTE Statutory Public Document</span>
          </div>
          <DialogTitle className="text-xl">Mandatory Disclosure Docket</DialogTitle>
          <DialogDescription>
            Official institutional disclosure under Section 10 of AICTE Act, 1987.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-foreground">Apex Institute of Technology</span>
              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                AICTE Approved
              </Badge>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-0.5 border-b border-border/40">
                <span className="text-muted-foreground">Permanent Institute ID:</span>
                <span className="font-mono font-bold text-foreground">1-98421094</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-border/40">
                <span className="text-muted-foreground">Approval Year:</span>
                <span className="font-semibold text-foreground">{dossier.academic_year}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-border/40">
                <span className="text-muted-foreground">Application Number:</span>
                <span className="font-mono text-primary">{dossier.application_number}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-border/40">
                <span className="text-muted-foreground">Deficiency Index:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {dossier.deficiency_index.toFixed(1)}% (Zero Deficiency)
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-muted-foreground">EVC Inspection:</span>
                <span className="font-semibold uppercase text-emerald-600 dark:text-emerald-400">
                  {dossier.evc_inspection_status}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted/40 border border-border/50 space-y-1 text-xs">
            <span className="font-semibold text-foreground">Digital Signature Seal:</span>
            <p className="font-mono text-[10px] text-muted-foreground break-all">
              {dossier.digital_signature_hash}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Close
            </Button>

            <Button
              size="sm"
              onClick={handleDownload}
              disabled={downloading}
              className="gap-1.5 text-xs bg-primary text-primary-foreground"
            >
              <Download className="h-3.5 w-3.5" />
              {downloading ? "Generating..." : "Download Mandatory Disclosure PDF"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
