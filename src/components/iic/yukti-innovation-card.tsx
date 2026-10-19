"use client";

import React from "react";
import { IicYuktiInnovation } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Lightbulb,
  Award,
  FileCheck2,
  Cpu,
  DollarSign,
  ShieldCheck,
  Building,
  User,
  Sparkles,
} from "lucide-react";

interface YuktiInnovationCardProps {
  innovation: IicYuktiInnovation;
}

export function YuktiInnovationCard({ innovation }: YuktiInnovationCardProps) {
  const getStageMeta = (stage: string) => {
    switch (stage) {
      case "ideation":
        return {
          label: "Ideation Stage",
          color: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
        };
      case "proof_of_concept":
        return {
          label: "Proof of Concept (PoC)",
          color: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
        };
      case "prototype":
        return {
          label: "Functional Prototype",
          color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
        };
      case "startup_commercialized":
        return {
          label: "Commercialized / Startup",
          color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        };
      default:
        return {
          label: "Innovation",
          color: "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30",
        };
    }
  };

  const getPatentBadge = (status: string) => {
    switch (status) {
      case "granted":
        return {
          label: "Patent Granted",
          color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        };
      case "published":
        return {
          label: "Patent Published",
          color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
        };
      case "filed":
        return {
          label: "Patent Filed",
          color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        };
      default:
        return {
          label: "IP Pending",
          color: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
        };
    }
  };

  const stageMeta = getStageMeta(innovation.innovation_stage);
  const patentMeta = getPatentBadge(innovation.patent_status);

  return (
    <Card className="overflow-hidden border border-border/60 hover:border-primary/40 hover:shadow-md transition-all duration-200 bg-card">
      <CardContent className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${stageMeta.color}`}
            >
              {stageMeta.label}
            </Badge>
            <Badge
              variant="outline"
              className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border-primary/20"
            >
              TRL {innovation.trl_level} / 9
            </Badge>
          </div>
          <Badge
            variant="outline"
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${patentMeta.color}`}
          >
            {patentMeta.label}
          </Badge>
        </div>

        <h3 className="text-base font-bold text-foreground leading-snug tracking-tight mb-2">
          {innovation.title}
        </h3>

        <div className="space-y-1.5 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="font-semibold text-foreground">Lead:</span>
            <span>{innovation.lead_innovator}</span>
            <span className="capitalize text-[11px] font-medium text-muted-foreground/80">
              ({innovation.innovator_type.replace("_", " ")})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
            <span>{innovation.department} • <strong className="text-foreground font-medium">{innovation.domain}</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 p-2.5 rounded-lg bg-muted/40 text-xs my-2.5">
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-mono">
              Seed Grant Tranche
            </span>
            <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              ₹{(innovation.seed_funding_received_inr / 1000).toFixed(0)}k Allocated
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-mono">
              National Recognition
            </span>
            <span className="font-semibold text-foreground truncate block mt-0.5" title={innovation.national_recognition_status}>
              {innovation.national_recognition_status}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border/40 text-xs">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <FileCheck2 className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-foreground/80 font-medium">YUKTI:</span>
            <span className="text-primary font-bold">{innovation.yukti_token}</span>
          </div>

          <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[150px]">
            {innovation.digital_signature_hash}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
