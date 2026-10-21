"use client";

import React from "react";
import { SwayamCreditTransfer } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  Database,
  Building,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

interface CreditTransferCardProps {
  transfer: SwayamCreditTransfer;
  onRatify?: (id: string) => void;
}

export function CreditTransferCard({ transfer, onRatify }: CreditTransferCardProps) {
  const statusConfig = {
    approved_transferred: {
      label: "Ratified & Transferred",
      color: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    },
    bos_cleared: {
      label: "BoS Cleared",
      color: "bg-blue-500/15 text-blue-500 border-blue-500/30",
    },
    pending_review: {
      label: "Under BoS Scrutiny",
      color: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    },
  }[transfer.approval_status];

  return (
    <Card className="border-border/60 hover:border-emerald-500/40 transition-all bg-card/60 backdrop-blur-sm shadow-sm">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{transfer.student_name}</span>
              <Badge variant="outline" className="text-xs font-mono">
                {transfer.roll_number}
              </Badge>
              <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs font-semibold">
                Grade: {transfer.grade_awarded}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {transfer.department} • APAAR ID: <code className="font-mono text-foreground/80">{transfer.apaar_id}</code>
            </p>
          </div>
          <Badge className={`text-xs font-semibold ${statusConfig.color}`}>
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2 space-y-3">
        {/* Equivalence Mapping Box */}
        <div className="p-3 rounded-lg bg-muted/40 border border-border/50 text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <GraduationCap className="h-3.5 w-3.5 text-blue-500" />
            SWAYAM MOOC: <span className="text-foreground font-semibold ml-1">{transfer.swayam_course_title}</span>
            <code className="text-[10px] ml-auto font-mono text-muted-foreground">{transfer.swayam_course_code}</code>
          </div>
          <div className="flex items-center justify-center py-0.5 text-muted-foreground">
            <ArrowRight className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <Building className="h-3.5 w-3.5 text-emerald-500" />
            Curriculum Equivalent: <span className="text-foreground font-semibold ml-1">{transfer.equivalent_curriculum_course}</span>
          </div>
        </div>

        {/* Credits Transferred & Council Reference */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="p-2 rounded bg-background/50 border border-border/40">
            <div className="text-[10px] text-muted-foreground">Credits Transferred</div>
            <div className="text-base font-bold text-emerald-500">
              {transfer.credits_transferred} NEP Credits
            </div>
          </div>
          <div className="p-2 rounded bg-background/50 border border-border/40">
            <div className="text-[10px] text-muted-foreground">BoS Approval Date</div>
            <div className="text-xs font-medium text-foreground">
              {transfer.bos_approval_date}
            </div>
          </div>
        </div>

        {/* ABC Sync & Token Bar */}
        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/40">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Database className="h-3 w-3 text-blue-500" />
            <span>ABC Bank: </span>
            <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[10px] px-1.5 py-0 font-semibold">
              Synced with Digilocker
            </Badge>
          </div>
          <span className="font-mono text-muted-foreground text-[10px]">
            {transfer.transfer_token}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
