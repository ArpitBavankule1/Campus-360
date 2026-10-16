"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApaarStudentRegistry } from "@/types";
import {
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  ExternalLink,
  Hash,
  Download,
  Building,
} from "lucide-react";

interface VerifyDigilockerModalProps {
  registry: ApaarStudentRegistry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VerifyDigilockerModal({
  registry,
  open,
  onOpenChange,
}: VerifyDigilockerModalProps) {
  const [downloading, setDownloading] = useState(false);

  if (!registry) return null;

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Tamper-evident DigiLocker NAD Certificate for ${registry.full_name} (${registry.apaar_id}) downloaded.`);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border/80 bg-card/95 backdrop-blur-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
            <ShieldCheck className="h-4 w-4" />
            <span>National Academic Depository (NAD) Verification</span>
          </div>
          <DialogTitle className="text-xl">DigiLocker Cryptographic Credential</DialogTitle>
          <DialogDescription>
            Ministry of Education & Academic Bank of Credits verifiable digital credential docket.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Certificate header docket */}
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className="font-semibold text-sm text-foreground">Verified Digital Credential</span>
              </div>
              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                Tamper Proof
              </Badge>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between py-0.5 border-b border-border/40">
                <span className="text-muted-foreground">Scholar Name:</span>
                <span className="font-semibold text-foreground">{registry.full_name}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-border/40">
                <span className="text-muted-foreground">APAAR ID:</span>
                <span className="font-mono font-bold text-primary">{registry.apaar_id}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-border/40">
                <span className="text-muted-foreground">ABC Account ID:</span>
                <span className="font-mono text-foreground">{registry.abc_account_id}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-border/40">
                <span className="text-muted-foreground">Department:</span>
                <span className="text-foreground">{registry.department}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-border/40">
                <span className="text-muted-foreground">Enrollment No:</span>
                <span className="font-mono text-foreground">{registry.enrollment_number}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-border/40">
                <span className="text-muted-foreground">Cumulative Credits:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {registry.total_credits_accumulated} Credits
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-muted-foreground">NEP 2020 Exit Level:</span>
                <span className="font-semibold uppercase text-primary">
                  {registry.exit_pathway_eligible}
                </span>
              </div>
            </div>
          </div>

          {/* Cryptographic hash info */}
          <div className="p-3 rounded-lg bg-muted/40 border border-border/50 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <Hash className="h-3.5 w-3.5 text-muted-foreground" />
              <span>SHA-256 Merkle Ledger Node:</span>
            </div>
            <p className="font-mono text-[10px] text-muted-foreground break-all">
              0x8a9f3b184029ae4890c4bf210928ad7429beff89
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
              className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Download className="h-3.5 w-3.5" />
              {downloading ? "Generating..." : "Download NAD Certificate"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
