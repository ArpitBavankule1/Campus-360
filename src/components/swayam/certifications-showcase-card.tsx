"use client";

import React from "react";
import { SwayamCertification } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Award,
  Medal,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  QrCode,
} from "lucide-react";

interface CertificationsShowcaseCardProps {
  certification: SwayamCertification;
  onViewDetails?: (cert: SwayamCertification) => void;
}

export function CertificationsShowcaseCard({
  certification,
  onViewDetails,
}: CertificationsShowcaseCardProps) {
  const tierConfig = {
    elite_gold: {
      label: "Elite + Gold (>=90%)",
      color: "bg-amber-500/15 text-amber-500 border-amber-500/30",
      badgeClass: "from-amber-500 to-yellow-600 text-amber-950",
      icon: TrophyMedal,
    },
    elite_silver: {
      label: "Elite + Silver (75-89%)",
      color: "bg-slate-300/20 text-slate-300 border-slate-300/30",
      badgeClass: "from-slate-300 to-slate-400 text-slate-900",
      icon: SilverMedal,
    },
    elite: {
      label: "Elite (60-74%)",
      color: "bg-blue-500/15 text-blue-500 border-blue-500/30",
      badgeClass: "from-blue-500 to-indigo-600 text-white",
      icon: Award,
    },
    successfully_completed: {
      label: "Successfully Completed",
      color: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
      badgeClass: "from-emerald-500 to-teal-600 text-white",
      icon: CheckCircle2,
    },
    participation: {
      label: "Participation",
      color: "bg-muted text-muted-foreground border-border/50",
      badgeClass: "from-gray-500 to-gray-600 text-white",
      icon: Award,
    },
  }[certification.cert_tier];

  function TrophyMedal(props: React.SVGProps<SVGSVGElement>) {
    return <Medal {...props} className="text-amber-500" />;
  }
  function SilverMedal(props: React.SVGProps<SVGSVGElement>) {
    return <Medal {...props} className="text-slate-300" />;
  }

  const TierIcon = tierConfig.icon;

  return (
    <Card className="border-border/60 hover:border-blue-500/40 transition-all bg-card/60 backdrop-blur-sm shadow-sm flex flex-col justify-between">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <Badge className={`text-xs font-semibold flex items-center gap-1.5 ${tierConfig.color}`}>
            <TierIcon className="h-3.5 w-3.5" />
            {tierConfig.label}
          </Badge>
          <div className="flex items-center gap-1">
            {certification.aicte_fdp_credits > 0 && (
              <Badge className="bg-purple-500/15 text-purple-400 border-purple-500/30 text-[10px] font-semibold">
                AICTE FDP ({certification.aicte_fdp_credits} Wk)
              </Badge>
            )}
            <Badge variant="outline" className="text-[10px] font-mono">
              {certification.offering_institute}
            </Badge>
          </div>
        </div>

        <CardTitle className="text-base font-semibold leading-snug mt-2 text-foreground">
          {certification.course_title}
        </CardTitle>
        <div className="text-xs text-muted-foreground mt-0.5">
          Candidate: <strong className="text-foreground">{certification.candidate_name}</strong> ({certification.roll_number})
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-1 space-y-3">
        {/* Score Breakdown Grid */}
        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-muted/30 border border-border/40 text-center text-xs">
          <div>
            <div className="text-muted-foreground text-[10px]">Assignment (25%)</div>
            <div className="font-bold text-foreground text-sm">{certification.assignment_score}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-[10px]">Proctored Exam (75%)</div>
            <div className="font-bold text-foreground text-sm">{certification.exam_score}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-[10px]">Final Score</div>
            <div className="font-extrabold text-blue-500 text-sm">{certification.consolidated_score}%</div>
          </div>
        </div>

        {/* Verification Hash & Seals */}
        <div className="text-[11px] font-mono text-muted-foreground space-y-1 bg-background/50 p-2 rounded border border-border/30">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground/70">Certificate:</span>
            <span className="text-foreground font-semibold">{certification.cert_token}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground/70">Hash:</span>
            <span className="truncate max-w-[170px] text-muted-foreground">{certification.verification_hash}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground/70">Issued:</span>
            <span className="text-foreground">{certification.issued_date}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-medium flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" /> Cryptographically Sealed
          </Badge>
          {onViewDetails && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(certification)}
              className="text-xs h-7 px-2.5 flex items-center gap-1"
            >
              <QrCode className="h-3 w-3" />
              Verify QR
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
