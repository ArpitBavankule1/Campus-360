"use client";

import React from "react";
import { DisbursementTranche } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Landmark, CheckCircle2, Clock, ShieldCheck } from "lucide-react";

interface AwardDisbursementCardProps {
  disbursement: DisbursementTranche;
}

export function AwardDisbursementCard({
  disbursement,
}: AwardDisbursementCardProps) {
  const isCredited = disbursement.status === "Credited";

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 via-card/50 to-background/80 p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 group-hover:scale-105 transition-transform">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm tracking-tight leading-tight line-clamp-1">
              {disbursement.scheme_name}
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              Tranche #{disbursement.tranche_number} • {disbursement.tranche_code}
            </span>
          </div>
        </div>
        <Badge
          variant="outline"
          className={
            isCredited
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
              : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
          }
        >
          {disbursement.status}
        </Badge>
      </div>

      <div className="space-y-1.5 py-2 text-xs text-muted-foreground border-y border-border/40 my-2.5">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Beneficiary Scholar:</span>
          <span className="font-medium text-foreground">{disbursement.scholar_name} ({disbursement.scholar_id})</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Bank UTR Ref:</span>
          <span className="font-mono text-foreground text-[11px]">{disbursement.bank_ref_no}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Disbursed Date:</span>
          <span className="font-medium text-foreground">{disbursement.disbursement_date}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          Verified Direct Benefit Transfer
        </span>
        <span className="text-base font-bold text-emerald-500">
          ₹{disbursement.amount_inr.toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
}
