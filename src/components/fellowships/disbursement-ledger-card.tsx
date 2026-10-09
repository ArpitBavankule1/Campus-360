"use client";

import React, { useState } from "react";
import { FellowshipDisbursement } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Download,
  Building,
} from "lucide-react";

interface DisbursementLedgerCardProps {
  disbursements: FellowshipDisbursement[];
}

export function DisbursementLedgerCard({ disbursements }: DisbursementLedgerCardProps) {
  const [downloadedVoucher, setDownloadedVoucher] = useState<string | null>(null);

  const handleDownloadSlip = (voucherToken: string) => {
    setDownloadedVoucher(voucherToken);
    setTimeout(() => {
      setDownloadedVoucher(null);
    }, 2500);
  };

  const totalEarned = disbursements
    .filter((d) => d.status === "disbursed")
    .reduce((acc, d) => acc + d.net_stipend_inr, 0);

  return (
    <Card className="border border-border/60 bg-card/60 backdrop-blur-md shadow-sm">
      <CardHeader className="pb-3 border-b border-border/40 bg-muted/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            Monthly Stipend Payroll & Direct Benefit Transfer (DBT)
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            Escrow-backed stipend releases credited directly to student bank accounts.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Total Received:</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm flex items-center">
            <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
            ₹{totalEarned.toLocaleString("en-IN")}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        {disbursements.map((item) => {
          const isDisbursed = item.status === "disbursed";
          const isEscrowLocked = item.status === "escrow_locked";

          return (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-border/60 bg-background/60 hover:border-primary/40 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">{item.disbursement_month}</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold ${
                        isDisbursed
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          : isEscrowLocked
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {isDisbursed ? "DBT Credited" : isEscrowLocked ? "Escrow Locked (31st Release)" : "Under Audit"}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {item.fellowship_title}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-base text-foreground flex items-center justify-end">
                    <IndianRupee className="w-4 h-4 mr-0.5 text-emerald-600 dark:text-emerald-400" />
                    ₹{item.net_stipend_inr.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-muted-foreground block font-mono">
                    Gross: ₹{item.gross_stipend_inr.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-muted/30 border border-border/40 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>A/C: <strong className="font-mono text-foreground">{item.dbt_bank_account_mask}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">UTR: <strong className="font-mono text-foreground text-[11px]">{item.utr_transaction_number}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>Voucher: <strong className="font-mono text-primary text-[11px]">{item.voucher_token}</strong></span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-muted-foreground">
                  Scholar: {item.student_name} ({item.roll_number})
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownloadSlip(item.voucher_token)}
                  className="text-xs h-7 gap-1 font-semibold"
                >
                  {downloadedVoucher === item.voucher_token ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      Downloaded!
                    </>
                  ) : (
                    <>
                      <Download className="w-3 h-3" />
                      Download Slip
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
