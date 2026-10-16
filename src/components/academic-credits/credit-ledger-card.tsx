"use client";

import React from "react";
import { AcademicCreditLedger } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Building,
  CheckCircle2,
  Clock,
  ArrowRightLeft,
  Lock,
  Hash,
  Sparkles,
} from "lucide-react";

interface CreditLedgerCardProps {
  ledger: AcademicCreditLedger;
}

export function CreditLedgerCard({ ledger }: CreditLedgerCardProps) {
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "major":
        return { label: "Discipline Major", color: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30" };
      case "minor":
        return { label: "Discipline Minor", color: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30" };
      case "multidisciplinary":
        return { label: "Multidisciplinary", color: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30" };
      case "aec":
        return { label: "AEC (Ability Enhancement)", color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" };
      case "sec":
        return { label: "SEC (Skill Enhancement)", color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30" };
      case "vac":
        return { label: "Value Added (VAC)", color: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30" };
      case "internship_project":
        return { label: "Internship / Capstone", color: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30" };
      default:
        return { label: category, color: "bg-muted text-muted-foreground border-border" };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified_nad":
        return {
          label: "NAD DigiLocker Verified",
          color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
          icon: CheckCircle2,
        };
      case "deposited":
        return {
          label: "Deposited in ABC",
          color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
          icon: Clock,
        };
      case "transferred":
        return {
          label: "Credit Transferred",
          color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
          icon: ArrowRightLeft,
        };
      case "redeemed":
        return {
          label: "Redeemed for Degree",
          color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
          icon: Sparkles,
        };
      case "locked":
        return {
          label: "Archival Locked",
          color: "bg-muted text-muted-foreground border-border",
          icon: Lock,
        };
      default:
        return {
          label: status,
          color: "bg-muted text-muted-foreground border-border",
          icon: Clock,
        };
    }
  };

  const cat = getCategoryBadge(ledger.course_category);
  const st = getStatusBadge(ledger.verification_status);
  const StatusIcon = st.icon;

  return (
    <Card className="overflow-hidden border-border/80 bg-card/60 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-md">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-xs font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                {ledger.course_code}
              </span>
              <Badge variant="outline" className={`text-[10px] font-medium ${cat.color}`}>
                {cat.label}
              </Badge>
            </div>
            <h4 className="text-sm font-semibold text-foreground pt-1">{ledger.course_title}</h4>
          </div>

          <div className="text-right shrink-0">
            <div className="text-base font-extrabold text-foreground">
              {ledger.credits} <span className="text-xs font-normal text-muted-foreground">Credits</span>
            </div>
            <div className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
              Grade: {ledger.grade_earned} ({ledger.grade_points.toFixed(1)})
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40 gap-y-1.5">
          <div className="flex items-center gap-1.5">
            <Building className="h-3.5 w-3.5 text-muted-foreground/70" />
            <span className="truncate max-w-[220px]">{ledger.awarding_institution}</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <BookOpen className="h-3.5 w-3.5 text-muted-foreground/70" />
            <span>{ledger.semester_earned} • {ledger.academic_year}</span>
          </div>
        </div>

        {/* Cryptographic hash & verification info */}
        <div className="flex items-center justify-between p-2 rounded-md bg-muted/40 border border-border/40 text-[11px]">
          <div className="flex items-center gap-1.5 text-muted-foreground font-mono">
            <Hash className="h-3.5 w-3.5" />
            <span className="truncate max-w-[170px]" title={ledger.nad_transaction_hash}>
              Hash: {ledger.nad_transaction_hash}
            </span>
          </div>

          <Badge variant="outline" className={`text-[10px] gap-1 font-medium ${st.color}`}>
            <StatusIcon className="h-3 w-3" />
            {st.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
