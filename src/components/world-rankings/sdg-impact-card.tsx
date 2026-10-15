"use client";

import React from "react";
import { WorldRankingSdgImpact } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ExternalLink,
  Award,
  CheckCircle2,
  Building,
} from "lucide-react";

interface SdgImpactCardProps {
  sdg: WorldRankingSdgImpact;
}

export function SdgImpactCard({ sdg }: SdgImpactCardProps) {
  // Official UN SDG Color Palette mappings
  const getSdgColors = (sdgNum: number) => {
    switch (sdgNum) {
      case 3:
        return { bg: "bg-emerald-500", text: "text-emerald-500", light: "bg-emerald-500/10 border-emerald-500/20" };
      case 4:
        return { bg: "bg-red-600", text: "text-red-600", light: "bg-red-600/10 border-red-600/20" };
      case 6:
        return { bg: "bg-cyan-500", text: "text-cyan-500", light: "bg-cyan-500/10 border-cyan-500/20" };
      case 7:
        return { bg: "bg-amber-500", text: "text-amber-500", light: "bg-amber-500/10 border-amber-500/20" };
      case 9:
        return { bg: "bg-orange-500", text: "text-orange-500", light: "bg-orange-500/10 border-orange-500/20" };
      case 11:
        return { bg: "bg-yellow-600", text: "text-yellow-600", light: "bg-yellow-600/10 border-yellow-600/20" };
      case 13:
        return { bg: "bg-teal-600", text: "text-teal-600", light: "bg-teal-600/10 border-teal-600/20" };
      case 17:
        return { bg: "bg-blue-800", text: "text-blue-600 dark:text-blue-400", light: "bg-blue-600/10 border-blue-600/20" };
      default:
        return { bg: "bg-primary", text: "text-primary", light: "bg-primary/10 border-primary/20" };
    }
  };

  const colors = getSdgColors(sdg.sdg_number);

  return (
    <Card className="border-border/80 bg-card/60 backdrop-blur-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`h-11 w-11 rounded-xl ${colors.bg} text-white font-bold flex flex-col items-center justify-center shadow-sm flex-shrink-0`}>
              <span className="text-[10px] uppercase tracking-wider opacity-80 leading-none">SDG</span>
              <span className="text-base font-extrabold leading-none mt-0.5">{sdg.sdg_number}</span>
            </div>

            <div>
              <CardTitle className="text-sm font-bold leading-tight">{sdg.sdg_title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-[11px] font-mono border-border">
                  UN Agenda 2030
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  {sdg.lead_department}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="text-lg font-black text-foreground">
              {sdg.the_impact_score.toFixed(1)}
              <span className="text-xs text-muted-foreground font-normal"> / 100</span>
            </div>
            <Badge className={`text-[11px] font-medium mt-0.5 ${colors.light} ${colors.text} border`}>
              <Award className="h-3 w-3 mr-1" />
              {sdg.global_sdg_rank}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-1 text-xs">
        {/* Key Initiative */}
        <div className="p-3 rounded-lg bg-muted/40 border border-border/50 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Key Institutional Initiative
          </div>
          <p className="text-muted-foreground leading-relaxed">{sdg.key_initiative}</p>
        </div>

        {/* Audited KPI & Evidence */}
        <div className="flex items-start justify-between gap-2 pt-1 border-t border-border/40 text-muted-foreground">
          <div className="flex items-start gap-1.5 leading-relaxed">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>{sdg.audited_kpi}</span>
          </div>

          {sdg.evidence_url && (
            <a
              href={sdg.evidence_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium flex items-center gap-1 flex-shrink-0 ml-2"
            >
              Evidence
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
