"use client";

import React, { useState } from "react";
import { NbaProgram } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  ShieldCheck,
  Calendar,
  Award,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  UserCheck,
  TrendingUp,
} from "lucide-react";

interface NbaProgramCardProps {
  program: NbaProgram;
  onViewSar?: (program: NbaProgram) => void;
}

export function NbaProgramCard({ program, onViewSar }: NbaProgramCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accredited_6_years":
        return {
          label: "Accredited (6 Years)",
          color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        };
      case "accredited_3_years":
        return {
          label: "Accredited (3 Years)",
          color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
        };
      case "provisional":
        return {
          label: "Provisional Tier-1",
          color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
        };
      case "in_progress":
        return {
          label: "Evaluation In-Progress",
          color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
        };
      default:
        return {
          label: "Applied",
          color: "bg-muted text-muted-foreground border-border",
        };
    }
  };

  const statusInfo = getStatusBadge(program.accreditation_status);
  const scorePct = Math.min(100, Math.round((program.total_criteria_score / 1000) * 100));

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-border/80 bg-card">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="outline" className="font-semibold bg-primary/10 text-primary border-primary/30">
            {program.tier === "Tier_1_Washington_Accord" ? "Washington Accord Tier-1" : "Tier-2"}
          </Badge>
          <Badge variant="outline" className={`font-semibold ${statusInfo.color}`}>
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            {statusInfo.label}
          </Badge>
        </div>

        <CardTitle className="text-lg font-bold mt-2 text-foreground flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary shrink-0" />
          {program.program_name}
        </CardTitle>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1">
          <span>Dept: <strong className="text-foreground">{program.department}</strong></span>
          <span>•</span>
          <span>Code: <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">{program.program_code}</code></span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        <div className="bg-muted/40 p-3 rounded-lg border border-border/50">
          <div className="flex justify-between items-end mb-1">
            <div>
              <span className="text-xs text-muted-foreground">Evaluation Criteria Score:</span>
              <div className="text-2xl font-black text-foreground">
                {program.total_criteria_score.toFixed(1)}{" "}
                <span className="text-xs font-normal text-muted-foreground">/ 1000 pts</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                <TrendingUp className="w-3 h-3 text-emerald-500" /> Threshold:
              </span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {scorePct >= 75 ? "6-Year Valid" : "3-Year Valid"}
              </span>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden mt-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${scorePct}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-primary" />
            <span>Coord: <strong className="text-foreground">{program.program_coordinator}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-primary" />
            <span>HOD: <strong className="text-foreground">{program.hod_name}</strong></span>
          </div>
        </div>

        {expanded && (
          <div className="pt-3 border-t border-border/60 space-y-2 text-xs">
            <div className="flex justify-between items-center text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-primary" /> Validity Period:
              </span>
              <span className="font-semibold text-foreground">
                {program.validity_start} to {program.validity_end}
              </span>
            </div>
            <div className="flex justify-between items-center text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileCheck2 className="w-3.5 h-3.5 text-primary" /> SAR Identifier:
              </span>
              <code className="font-mono bg-muted px-2 py-0.5 rounded text-foreground font-bold">
                {program.sar_code}
              </code>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex justify-between gap-2 border-t border-border/40 py-2.5">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs w-full text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              Hide Details <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              View Accreditation Details <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
