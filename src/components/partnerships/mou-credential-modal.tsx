"use client";

import React from "react";
import { IndustryMoU } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QRCodeSVG } from "qrcode.react";
import {
  ShieldCheck,
  Building2,
  Calendar,
  IndianRupee,
  Award,
  CheckCircle2,
} from "lucide-react";

interface MoUCredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
  mou: IndustryMoU | null;
}

export function MoUCredentialModal({
  isOpen,
  onClose,
  mou,
}: MoUCredentialModalProps) {
  if (!mou) return null;

  const verificationUrl = `https://campuslens.ai/verify/mou/${mou.mou_token}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">Verifiable MoU Credential</DialogTitle>
              <DialogDescription className="text-xs">
                Deanery Institutional Industry Alliances Registry
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Card visual */}
          <div className="p-4 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-background space-y-3 relative overflow-hidden shadow-inner">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
                  Institutional Corporate Alliance
                </span>
                <h4 className="text-base font-bold text-foreground mt-0.5">{mou.partner_name}</h4>
                <p className="text-xs text-muted-foreground">{mou.industry_sector}</p>
              </div>
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary font-mono font-bold">
                {mou.partner_tier.toUpperCase()}
              </Badge>
            </div>

            <div className="border-t border-border/40 pt-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground block">MoU Docket Token</span>
                <span className="font-mono font-bold text-foreground">{mou.mou_token}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Tenure Validity</span>
                <span className="font-semibold text-foreground">{mou.valid_from} → {mou.valid_to}</span>
              </div>
            </div>

            <div className="pt-2 text-xs">
              <span className="text-[10px] text-muted-foreground block">Faculty Executive In-Charge</span>
              <span className="font-medium text-foreground">{mou.nodal_faculty_coordinator}</span>
            </div>

            {/* QR Code */}
            <div className="pt-2 flex flex-col items-center justify-center space-y-2 bg-background/80 p-3 rounded-lg border border-border/40">
              <QRCodeSVG value={verificationUrl} size={110} level="M" />
              <div className="text-center">
                <span className="font-mono text-[10px] text-muted-foreground block">
                  Scan to verify cryptographic ledger record
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Apex Deanery Certified
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
