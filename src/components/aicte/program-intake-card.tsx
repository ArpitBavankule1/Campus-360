"use client";

import React from "react";
import { AicteApprovedProgram } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Users,
  Award,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  ShieldCheck,
} from "lucide-react";

interface ProgramIntakeCardProps {
  program: AicteApprovedProgram;
}

export function ProgramIntakeCard({ program }: ProgramIntakeCardProps) {
  const getEoaStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return {
          label: "EoA Approved",
          color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
          icon: CheckCircle2,
        };
      case "under_scrutiny":
        return {
          label: "Scrutiny In-Progress",
          color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
          icon: Clock,
        };
      case "deficiency_flagged":
        return {
          label: "Deficiency Flagged",
          color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
          icon: AlertTriangle,
        };
      default:
        return {
          label: "Applied",
          color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
          icon: Clock,
        };
    }
  };

  const getAccreditationBadge = (status: string) => {
    switch (status) {
      case "tier_1_accredited":
        return { label: "Tier-1 Washington Accord", color: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30" };
      case "accredited":
        return { label: "NBA Accredited", color: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30" };
      case "eligible":
        return { label: "Accreditation Eligible", color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30" };
      default:
        return { label: "Non-Accredited", color: "bg-muted text-muted-foreground border-border" };
    }
  };

  const st = getEoaStatusBadge(program.eoa_status);
  const StatusIcon = st.icon;
  const acc = getAccreditationBadge(program.accreditation_status);

  return (
    <Card className="overflow-hidden border-border/80 bg-card/60 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-md">
      <CardContent className="p-4 space-y-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-[10px] font-bold text-primary uppercase px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                {program.program_level}
              </span>
              <Badge variant="outline" className={`text-[10px] font-medium ${acc.color}`}>
                <Award className="h-3 w-3 mr-1" />
                {acc.label}
              </Badge>
            </div>
            <h4 className="text-sm font-semibold text-foreground pt-1">{program.program_name}</h4>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Building2 className="h-3 w-3 text-muted-foreground/70" />
              <span>{program.department}</span>
            </p>
          </div>

          <Badge variant="outline" className={`text-[10px] gap-1 font-medium ${st.color}`}>
            <StatusIcon className="h-3 w-3" />
            {st.label}
          </Badge>
        </div>

        {/* Intake Metrics Box */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-muted/40 border border-border/50 text-center">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase font-medium">Approved Intake</div>
            <div className="text-lg font-black text-foreground">
              {program.approved_intake} <span className="text-xs font-normal text-muted-foreground">Seats</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase font-medium">Applied Intake</div>
            <div className="text-lg font-black text-primary">
              {program.applied_intake} <span className="text-xs font-normal text-muted-foreground">Seats</span>
            </div>
          </div>
        </div>

        {/* Supernumerary Quota Indicators */}
        <div className="flex flex-wrap items-center justify-between text-xs pt-1 border-t border-border/40 gap-1.5">
          <span className="text-[11px] text-muted-foreground">Supernumerary Quotas:</span>
          <div className="flex items-center gap-1">
            {program.nri_quota_approved && (
              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                NRI Approved
              </Badge>
            )}
            {program.pio_fn_quota_approved && (
              <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30">
                OCI/PIO/FN
              </Badge>
            )}
            {program.tfw_quota_approved && (
              <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30">
                TFW 5%
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
