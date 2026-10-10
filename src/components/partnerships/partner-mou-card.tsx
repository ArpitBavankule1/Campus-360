"use client";

import React from "react";
import { IndustryMoU } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Calendar,
  ShieldCheck,
  Award,
  ExternalLink,
  UserCheck,
  FileText,
  IndianRupee,
} from "lucide-react";

interface PartnerMoUCardProps {
  mou: IndustryMoU;
  onViewCredentials: (mou: IndustryMoU) => void;
}

export function PartnerMoUCard({ mou, onViewCredentials }: PartnerMoUCardProps) {
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "strategic":
        return { label: "Strategic Alliance", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30" };
      case "core":
        return { label: "Core Enterprise", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30" };
      case "affiliate":
        return { label: "Affiliate Partner", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" };
      default:
        return { label: tier, color: "bg-muted text-muted-foreground" };
    }
  };

  const tierBadge = getTierBadge(mou.partner_tier);
  const formattedCommitment = (mou.financial_commitment_inr / 10000000).toFixed(2);

  return (
    <Card className="border border-border/60 bg-card/60 backdrop-blur-md shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/40 bg-muted/15">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={`text-xs font-semibold ${tierBadge.color}`}>
                {tierBadge.label}
              </Badge>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold">
                {mou.mou_token}
              </span>
            </div>
            <CardTitle className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2 mt-1">
              <Building2 className="w-5 h-5 text-primary shrink-0" />
              {mou.partner_name}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{mou.industry_sector}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4 text-sm">
        <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
          {mou.scope}
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs bg-muted/30 p-2.5 rounded-lg border border-border/40">
          <div>
            <span className="text-muted-foreground block text-[11px]">Financial Commitment</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-0.5">
              <IndianRupee className="w-3.5 h-3.5" />
              ₹{formattedCommitment} Cr
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Validity Term</span>
            <span className="font-medium text-foreground flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3 text-muted-foreground" />
              {mou.valid_to}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-primary" /> Key Strategic Objectives:
          </span>
          <ul className="text-xs space-y-1 text-muted-foreground list-disc list-inside">
            {mou.key_objectives.map((obj, idx) => (
              <li key={idx} className="line-clamp-1">{obj}</li>
            ))}
          </ul>
        </div>

        <div className="text-[11px] text-muted-foreground border-t border-border/30 pt-2 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-primary" /> {mou.nodal_faculty_coordinator}
          </span>
          <Badge variant="secondary" className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-500/10">
            {mou.status}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-4 border-t border-border/40 bg-muted/10 flex justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs flex-1 gap-1.5"
          onClick={() => onViewCredentials(mou)}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          Verify Credentials
        </Button>
      </CardFooter>
    </Card>
  );
}
