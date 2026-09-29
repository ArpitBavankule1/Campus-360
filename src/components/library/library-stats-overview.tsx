"use client";

import React from "react";
import { StudentLibrarySummary, InstitutionalLibraryStats } from "@/types";
import {
  BookOpen,
  BookmarkCheck,
  AlertCircle,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Clock,
} from "lucide-react";

interface LibraryStatsOverviewProps {
  summary: StudentLibrarySummary;
  stats?: InstitutionalLibraryStats;
}

export function LibraryStatsOverview({ summary, stats }: LibraryStatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Active Borrowed Books */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card/80 to-primary/5 p-5 shadow-sm transition-all hover:border-primary/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Active Borrowed Books
          </span>
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <div className="text-3xl font-black text-foreground mt-2">
          {summary.activeBorrowsCount} <span className="text-sm font-medium text-muted-foreground">/ 3 Quota</span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5 text-primary/70" />
          <span>Standard 14-day checkout window</span>
        </div>
      </div>

      {/* Overdue Loans & Accrued Fines */}
      <div
        className={`rounded-2xl border p-5 shadow-sm transition-all ${
          summary.overdueCount > 0 || summary.totalFinesPending > 0
            ? "border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-card to-card"
            : "border-border/60 bg-gradient-to-br from-emerald-500/10 via-card to-card"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Overdue Fines
          </span>
          {summary.overdueCount > 0 ? (
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          )}
        </div>
        <div className="text-3xl font-black text-foreground mt-2">
          ₹{summary.totalFinesPending.toFixed(2)}
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-xs">
          {summary.overdueCount > 0 ? (
            <span className="font-medium text-amber-600 dark:text-amber-400">
              {summary.overdueCount} item(s) past return deadline (₹5/day)
            </span>
          ) : (
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              Zero overdue items • Clean account
            </span>
          )}
        </div>
      </div>

      {/* Active Reservations */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card/80 to-purple-500/5 p-5 shadow-sm transition-all hover:border-purple-500/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Active Holds / Holds
          </span>
          <BookmarkCheck className="w-5 h-5 text-purple-500" />
        </div>
        <div className="text-3xl font-black text-foreground mt-2">
          {summary.reservationsCount}
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
          <span>Desk hold queue & pickup verification</span>
        </div>
      </div>

      {/* Circulation Clearance Privilege */}
      <div
        className={`rounded-2xl border p-5 shadow-sm transition-all ${
          summary.borrowingPrivilegeActive
            ? "border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-card to-card"
            : "border-red-500/40 bg-gradient-to-br from-red-500/10 via-card to-card"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Borrowing Privilege
          </span>
          {summary.borrowingPrivilegeActive ? (
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
        </div>
        <div className="mt-2">
          {summary.borrowingPrivilegeActive ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
              ✓ Good Standing
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 text-red-700 dark:text-red-300 font-bold text-sm">
              ⚠ Fines Pending
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {summary.borrowingPrivilegeActive
            ? "Eligible for book checkout & semester renewal"
            : "Clear overdue dues at Circulation Desk"}
        </p>
      </div>

      {/* Institutional telemetry banner if stats are available */}
      {stats && (
        <div className="col-span-1 sm:col-span-2 lg:col-span-4 rounded-xl border border-border/50 bg-muted/30 px-4 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-foreground">Vikram Sarabhai Central Library Telemetry:</span>
            <span className="text-muted-foreground">
              {stats.totalVolumes.toLocaleString()} physical volumes in catalog
            </span>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>
              <strong>{stats.totalActiveLoans}</strong> active loans across campus
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-primary">
              <FileText className="w-3.5 h-3.5" />
              <strong>{stats.digitalAccessCount.toLocaleString()}</strong> digital paper downloads
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
