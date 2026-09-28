"use client";

import React from "react";
import { StudentFeeSummary } from "@/types";
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  ShieldCheck,
  TrendingDown,
  Sparkles,
} from "lucide-react";

interface FeeSummaryCardsProps {
  summary: StudentFeeSummary;
}

export function FeeSummaryCards({ summary }: FeeSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Payable */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card/80 to-primary/5 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total Assessed Dues
          </span>
          <CreditCard className="w-5 h-5 text-primary" />
        </div>
        <div className="text-3xl font-black text-foreground mt-2">
          ₹{summary.totalPayable.toLocaleString()}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Across {summary.duesCount} semester fee heads
        </p>
      </div>

      {/* Total Paid */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-emerald-500/10 via-card to-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Total Remitted
          </span>
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        </div>
        <div className="text-3xl font-black text-foreground mt-2">
          ₹{summary.totalPaid.toLocaleString()}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {summary.paidCount} of {summary.duesCount} heads fully cleared
        </p>
      </div>

      {/* Outstanding Balance */}
      <div
        className={`rounded-2xl border p-5 shadow-sm ${
          summary.outstandingBalance > 0
            ? "border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-card"
            : "border-border/60 bg-card"
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-semibold uppercase tracking-wider ${
              summary.outstandingBalance > 0
                ? "text-amber-600 dark:text-amber-400"
                : "text-muted-foreground"
            }`}
          >
            Outstanding Balance
          </span>
          <TrendingDown
            className={`w-5 h-5 ${
              summary.outstandingBalance > 0 ? "text-amber-500" : "text-muted-foreground"
            }`}
          />
        </div>
        <div className="text-3xl font-black text-foreground mt-2">
          ₹{summary.outstandingBalance.toLocaleString()}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {summary.hasOverdue ? "⚠️ Overdue dues require attention" : "No overdue penalties"}
        </p>
      </div>

      {/* Examination Clearance Badge */}
      <div
        className={`rounded-2xl border p-5 shadow-sm ${
          summary.feeClearanceStatus
            ? "border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-card to-card"
            : "border-rose-500/30 bg-gradient-to-br from-rose-500/15 via-card to-card"
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-semibold uppercase tracking-wider ${
              summary.feeClearanceStatus
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-500"
            }`}
          >
            Admit Card Clearance
          </span>
          <ShieldCheck
            className={`w-5 h-5 ${
              summary.feeClearanceStatus ? "text-emerald-500" : "text-rose-500"
            }`}
          />
        </div>
        <div className="text-xl font-black mt-2 flex items-center gap-1.5">
          {summary.feeClearanceStatus ? (
            <span className="text-emerald-600 dark:text-emerald-400">CLEARED ✓</span>
          ) : (
            <span className="text-rose-500">HOLD PENDING</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {summary.feeClearanceStatus
            ? "Eligible for Phase 19 Exam Hall Ticket"
            : "Clear dues to download Hall Ticket"}
        </p>
      </div>
    </div>
  );
}
