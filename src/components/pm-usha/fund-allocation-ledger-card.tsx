"use client";

import React from "react";
import { PmUshaFundAllocation, PmUshaDisbursalStatus } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowDownRight,
  Landmark,
  FileCheck,
} from "lucide-react";

interface FundAllocationLedgerCardProps {
  allocations: PmUshaFundAllocation[];
}

export function FundAllocationLedgerCard({
  allocations,
}: FundAllocationLedgerCardProps) {
  const getDisbursalBadge = (status: PmUshaDisbursalStatus) => {
    switch (status) {
      case "PFMS_Credited":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> PFMS Credited
          </Badge>
        );
      case "Pending_State_Share":
        return (
          <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[11px] font-semibold flex items-center gap-1">
            <Clock className="h-3 w-3" /> State Share Pending
          </Badge>
        );
      case "Sanctioned":
        return (
          <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/30 text-[11px] font-semibold flex items-center gap-1">
            <Clock className="h-3 w-3" /> Sanction Issued
          </Badge>
        );
      case "On_Hold":
        return (
          <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/30 text-[11px] font-semibold flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> On Hold
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUtilizationBadge = (status: string) => {
    switch (status) {
      case "Partially_Utilized":
        return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
      case "Fully_Utilized":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      default:
        return "bg-muted text-muted-foreground border-border/50";
    }
  };

  return (
    <Card className="border-border/60 bg-card/60 shadow-sm">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
              <Wallet className="h-5 w-5 text-teal-400" />
              PFMS Fund Disbursals & Allocation Ledger
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Public Financial Management System (PFMS) grants tracking, central and state fund credits
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2">
        <div className="space-y-3">
          {allocations.map((alloc) => (
            <div
              key={alloc.id}
              className="p-4 rounded-xl border border-border/50 bg-background/50 hover:border-teal-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-foreground">
                    {alloc.allocation_code}
                  </span>
                  <Badge variant="outline" className="text-[10px] font-medium border-border/60">
                    Tranche #{alloc.installment_number}
                  </Badge>
                  {getDisbursalBadge(alloc.disbursal_status)}
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-medium border capitalize ${getUtilizationBadge(
                      alloc.utilization_status
                    )}`}
                  >
                    {alloc.utilization_status.replace(/_/g, " ")}
                  </Badge>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <FileCheck className="h-3.5 w-3.5 text-teal-400" />
                    Sanction: {alloc.sanction_order_no}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-3">
                    <span>Sanction Date: {alloc.sanction_date}</span>
                    <span>•</span>
                    <span>PFMS Txn: {alloc.pfms_transaction_id}</span>
                    {alloc.disbursal_date && (
                      <>
                        <span>•</span>
                        <span>Credited: {alloc.disbursal_date}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Fund Split Breakdown */}
              <div className="flex items-center gap-4 bg-muted/30 p-3 rounded-lg border border-border/40 text-xs">
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground block">Central Share</span>
                  <span className="font-bold text-teal-400">
                    ₹{alloc.central_share_amount_lakhs.toFixed(2)} L
                  </span>
                </div>
                <div className="h-7 w-[1px] bg-border/60" />
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground block">State Share</span>
                  <span className="font-bold text-cyan-400">
                    ₹{alloc.state_share_amount_lakhs.toFixed(2)} L
                  </span>
                </div>
                <div className="h-7 w-[1px] bg-border/60" />
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground block">Total Sanctioned</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    ₹{alloc.total_sanctioned_lakhs.toFixed(2)} L
                  </span>
                </div>
              </div>
            </div>
          ))}

          {allocations.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              <Landmark className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No fund allocations recorded in this cycle.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
