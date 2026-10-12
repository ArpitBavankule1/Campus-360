"use client";

import React from "react";
import { IqacBestPractice } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Users,
  Target,
  Award,
  Globe2,
  CheckCircle2,
} from "lucide-react";

interface BestPracticeCardProps {
  practice: IqacBestPractice;
  onVerify?: (token: string) => void;
}

export function BestPracticeCard({ practice, onVerify }: BestPracticeCardProps) {
  return (
    <Card className="hover:shadow-md transition-all duration-200 border-border/80">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="outline" className="font-mono text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
            {practice.thematic_area}
          </Badge>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
            {practice.institutional_status === "nationally_recognized"
              ? "National Recognition"
              : "Institutionalized"}
          </Badge>
        </div>
        <CardTitle className="text-base font-bold mt-2 text-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>{practice.practice_title}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 pb-3 text-xs">
        {/* Token and Beneficiaries */}
        <div className="flex items-center justify-between p-2 rounded-md bg-muted/50 border border-border/60">
          <span className="font-mono text-muted-foreground">{practice.practice_token}</span>
          <span className="flex items-center gap-1 font-semibold text-primary">
            <Users className="w-3.5 h-3.5" />
            {practice.beneficiaries_impacted.toLocaleString()} Scholars Impacted
          </span>
        </div>

        {/* Objectives */}
        <div className="space-y-1">
          <span className="font-semibold text-muted-foreground">Core Objectives:</span>
          <p className="text-muted-foreground leading-relaxed">{practice.objectives}</p>
        </div>

        {/* Evidence of Success */}
        <div className="p-2.5 rounded-lg bg-background/80 border border-border/60 space-y-1">
          <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Evidence of Success:</span>
          </div>
          <p className="text-muted-foreground leading-relaxed pl-5">{practice.evidence_of_success}</p>
        </div>

        {/* SDG alignment badges */}
        {practice.sdg_goals && practice.sdg_goals.length > 0 && (
          <div className="pt-1 flex flex-wrap gap-1">
            {practice.sdg_goals.map((sdg, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-[10px] bg-muted/60 text-muted-foreground flex items-center gap-1"
              >
                <Globe2 className="w-3 h-3 text-blue-500" />
                {sdg}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 pb-3 border-t border-border/50 flex justify-between items-center text-xs">
        <span className="text-[11px] font-mono text-muted-foreground">
          NAAC Criterion VII Distinctiveness
        </span>
        {onVerify && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => onVerify(practice.practice_token)}
          >
            Verify Certificate
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
