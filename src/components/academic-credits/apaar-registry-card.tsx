"use client";

import React from "react";
import { ApaarStudentRegistry } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  GraduationCap,
  ExternalLink,
  BookOpen,
} from "lucide-react";

interface ApaarRegistryCardProps {
  registry: ApaarStudentRegistry;
  onViewLedger?: (registry: ApaarStudentRegistry) => void;
  onVerifyDigilocker?: (registry: ApaarStudentRegistry) => void;
}

export function ApaarRegistryCard({
  registry,
  onViewLedger,
  onVerifyDigilocker,
}: ApaarRegistryCardProps) {
  const getKycBadge = (status: string) => {
    switch (status) {
      case "verified":
        return {
          label: "Aadhaar e-KYC Verified",
          color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
          icon: CheckCircle2,
        };
      case "pending":
        return {
          label: "KYC Verification Pending",
          color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
          icon: Clock,
        };
      default:
        return {
          label: "Action Required",
          color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
          icon: AlertCircle,
        };
    }
  };

  const getExitPathwayBadge = (pathway: string) => {
    switch (pathway) {
      case "honours_research":
        return { label: "Honours w/ Research (160+)", color: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30" };
      case "degree":
        return { label: "Bachelor's Degree (120+)", color: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30" };
      case "diploma":
        return { label: "Undergraduate Diploma (80+)", color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30" };
      case "certificate":
        return { label: "UG Certificate (40+)", color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" };
      default:
        return { label: "Foundation Stage (<40)", color: "bg-muted text-muted-foreground border-border" };
    }
  };

  const kyc = getKycBadge(registry.kyc_status);
  const KycIcon = kyc.icon;
  const exitBadge = getExitPathwayBadge(registry.exit_pathway_eligible);

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50 border-border/80 bg-card/60 backdrop-blur-sm">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 opacity-80" />

      <CardHeader className="pb-3 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                {registry.full_name}
              </CardTitle>
              <p className="text-xs text-muted-foreground font-mono">
                {registry.enrollment_number} • {registry.department}
              </p>
            </div>
          </div>
          <Badge variant="outline" className={`text-[11px] gap-1 font-medium ${kyc.color}`}>
            <KycIcon className="h-3 w-3" />
            {kyc.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* APAAR ID & ABC ID highlight banner */}
        <div className="p-3 rounded-lg bg-muted/40 border border-border/60 flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
              12-Digit APAAR ID
            </div>
            <div className="text-sm font-bold font-mono tracking-wider text-primary">
              {registry.apaar_id}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
              ABC Account ID
            </div>
            <div className="text-xs font-mono font-medium text-foreground">
              {registry.abc_account_id}
            </div>
          </div>
        </div>

        {/* Credit metrics grid */}
        <div className="grid grid-cols-3 gap-2 py-1 text-center">
          <div className="p-2 rounded-lg bg-background/60 border border-border/40">
            <div className="text-xs text-muted-foreground">Total Accumulated</div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {registry.total_credits_accumulated}
            </div>
            <div className="text-[10px] text-muted-foreground">Credits</div>
          </div>

          <div className="p-2 rounded-lg bg-background/60 border border-border/40">
            <div className="text-xs text-muted-foreground">Redeemed / Transferred</div>
            <div className="text-lg font-bold text-muted-foreground">
              {registry.total_credits_redeemed}
            </div>
            <div className="text-[10px] text-muted-foreground">Credits</div>
          </div>

          <div className="p-2 rounded-lg bg-background/60 border border-border/40">
            <div className="text-xs text-muted-foreground">Current Balance</div>
            <div className="text-lg font-bold text-primary">
              {registry.current_credit_balance}
            </div>
            <div className="text-[10px] text-muted-foreground">Available</div>
          </div>
        </div>

        {/* NEP 2020 Pathway */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-border/60">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>NEP 2020 Exit Eligibility:</span>
          </div>
          <Badge variant="outline" className={`text-[10px] font-medium ${exitBadge.color}`}>
            {exitBadge.label}
          </Badge>
        </div>

        {/* Actions bar */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewLedger?.(registry)}
            className="text-xs gap-1.5 h-8 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Credit Passbook
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onVerifyDigilocker?.(registry)}
            className="text-xs gap-1.5 h-8 px-3 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            DigiLocker NAD
            <ExternalLink className="h-3 w-3 ml-0.5 opacity-70" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
