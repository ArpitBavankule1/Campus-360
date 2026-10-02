"use client";

import React, { useState } from "react";
import { GrievanceResolutionOrder } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Scale,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Copy,
  Check,
} from "lucide-react";

interface ResolutionOrderModalProps {
  order: GrievanceResolutionOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ResolutionOrderModal({
  order,
  isOpen,
  onClose,
}: ResolutionOrderModalProps) {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.order_serial_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-3xl p-6 bg-card border border-border/80 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                Statutory Ombudsman Resolution Order
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Legally binding directive promulgated under UGC Redressal Regulations.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Order Header Card */}
          <div className="p-4 rounded-2xl bg-muted/50 border border-border/60 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-muted-foreground">
                Promulgated Serial Docket
              </div>
              <div className="font-mono font-extrabold text-sm text-primary flex items-center gap-1.5 mt-0.5">
                <span>{order.order_serial_code}</span>
                <button
                  onClick={handleCopyCode}
                  className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-muted-foreground">
                Enforcement Date
              </div>
              <div className="text-xs font-semibold text-foreground flex items-center gap-1 font-mono">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                {new Date(order.issued_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Presiding Authority */}
          <div className="text-xs space-y-1">
            <span className="font-bold text-foreground/80 block">Presiding Tribunal Authority:</span>
            <div className="text-muted-foreground font-medium bg-muted/30 p-2.5 rounded-xl border border-border/40">
              {order.presiding_authority}
            </div>
          </div>

          {/* Findings */}
          <div className="text-xs space-y-1">
            <span className="font-bold text-foreground/80 block">Findings & Inquiry Summary:</span>
            <p className="text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-xl border border-border/40 text-[11px]">
              {order.findings_summary}
            </p>
          </div>

          {/* Mandatory Directives */}
          <div className="text-xs space-y-1">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Mandatory Directives & Relief Granted:
            </span>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-foreground font-medium text-xs leading-relaxed">
              {order.mandatory_directives}
            </div>
          </div>

          {/* Seal Hash */}
          <div className="p-2.5 rounded-2xl bg-muted/60 text-[10px] text-muted-foreground flex items-center justify-between border border-border/40 font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Digital Seal Verified
            </span>
            <span>{order.digital_seal_hash}</span>
          </div>

          <Button
            className="w-full rounded-2xl text-xs h-9 bg-primary text-primary-foreground font-semibold"
            onClick={onClose}
          >
            Close Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
