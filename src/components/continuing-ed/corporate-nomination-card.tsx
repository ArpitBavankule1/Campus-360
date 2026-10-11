"use client";

import React from "react";
import { CorporateNomination } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  UserCheck,
  Award,
  CheckCircle2,
  Clock,
  Briefcase,
  FileCheck,
} from "lucide-react";

interface CorporateNominationCardProps {
  nomination: CorporateNomination;
  onViewPass: (nomination: CorporateNomination) => void;
}

export function CorporateNominationCard({
  nomination,
  onViewPass,
}: CorporateNominationCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sponsored_approved":
        return { label: "Corporate Sponsored", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" };
      case "scholarship_waived":
        return { label: "Institutional Grant", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30" };
      case "self_funded":
        return { label: "Self Sponsored", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30" };
      default:
        return { label: status, color: "bg-muted text-muted-foreground" };
    }
  };

  const statusBadge = getStatusBadge(nomination.sponsorship_status);

  return (
    <Card className="border border-border/60 bg-card/60 backdrop-blur-md shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/40 bg-muted/15">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <Badge variant="outline" className={`text-xs font-semibold ${statusBadge.color}`}>
              {statusBadge.label}
            </Badge>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold">
              {nomination.nomination_token}
            </span>
          </div>

          <div className="pt-1">
            <CardTitle className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-primary shrink-0" />
              <span>{nomination.participant_name}</span>
            </CardTitle>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Briefcase className="w-3 h-3" />
              <span>{nomination.designation} ({nomination.years_of_experience} yrs exp)</span>
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3 flex-1">
        <div className="text-xs space-y-1 bg-muted/20 p-2.5 rounded-md border border-border/40">
          <p className="text-muted-foreground flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="font-medium text-foreground">{nomination.corporate_sponsor}</span>
          </p>
          <p className="text-xs text-muted-foreground line-clamp-1">
            <span className="font-medium text-foreground">Program:</span> {nomination.program_title || "Executive MDP Program"}
          </p>
        </div>

        {/* Progress & Attendance */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-muted/30 p-2 rounded-lg border border-border/30">
            <Clock className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
            <span className="text-[10px] text-muted-foreground block">Attendance</span>
            <span className="text-xs font-bold text-foreground">{nomination.attendance_percentage}%</span>
          </div>
          <div className="bg-muted/30 p-2 rounded-lg border border-border/30">
            <Award className="w-3.5 h-3.5 text-amber-500 mx-auto mb-1" />
            <span className="text-[10px] text-muted-foreground block">Evaluation Grade</span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{nomination.grade}</span>
          </div>
        </div>

        {/* Capstone & Certificate Status */}
        <div className="flex items-center justify-between text-xs px-2 py-1.5 rounded bg-muted/20 border border-border/30">
          <div className="flex items-center gap-1.5">
            <CheckCircle2
              className={`w-3.5 h-3.5 ${
                nomination.capstone_submitted ? "text-emerald-500" : "text-muted-foreground"
              }`}
            />
            <span className="text-muted-foreground text-[11px]">
              {nomination.capstone_submitted ? "Capstone Verified" : "Capstone Pending"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {nomination.certificate_issued ? (
              <Badge variant="outline" className="text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                Issued: {nomination.certificate_token}
              </Badge>
            ) : (
              <span className="text-[10px] text-muted-foreground">In Review</span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-4 border-t border-border/40 bg-muted/10 flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground truncate">{nomination.participant_email}</span>
        <Button
          size="sm"
          variant="outline"
          className="text-xs h-8 border-border/60 hover:bg-primary/10 text-foreground flex items-center gap-1"
          onClick={() => onViewPass(nomination)}
        >
          <FileCheck className="w-3.5 h-3.5 text-primary" />
          <span>Executive Pass</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
