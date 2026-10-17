"use client";

import React from "react";
import { AicteInfrastructureNorm } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Layers,
  ShieldCheck,
} from "lucide-react";

interface InfrastructureNormCardProps {
  norm: AicteInfrastructureNorm;
}

export function InfrastructureNormCard({ norm }: InfrastructureNormCardProps) {
  const getComplianceBadge = (status: string) => {
    switch (status) {
      case "compliant":
        return {
          label: "100% Compliant (Zero Deficiency)",
          color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
          icon: CheckCircle2,
        };
      case "minor_deficiency":
        return {
          label: "Minor Deviation (<5%)",
          color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
          icon: AlertTriangle,
        };
      default:
        return {
          label: "Non-Compliant",
          color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
          icon: XCircle,
        };
    }
  };

  const comp = getComplianceBadge(norm.compliance_status);
  const CompIcon = comp.icon;

  const areaSurplusPct = Math.round(
    ((norm.available_area_sqm - norm.required_area_sqm) / norm.required_area_sqm) * 100
  );

  return (
    <Card className="overflow-hidden border-border/80 bg-card/60 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-md">
      <CardContent className="p-4 space-y-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Building className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">{norm.category_name}</h4>
                <span className="font-mono text-[10px] text-muted-foreground uppercase">{norm.room_type}</span>
              </div>
            </div>
          </div>

          <Badge variant="outline" className={`text-[10px] gap-1 font-medium ${comp.color}`}>
            <CompIcon className="h-3 w-3" />
            {comp.label}
          </Badge>
        </div>

        {/* Space Comparison Grid */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-muted/40 border border-border/50 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-medium">Required Carpet Area</span>
            <div className="text-sm font-bold text-foreground">
              {norm.required_area_sqm.toLocaleString()} <span className="text-[10px] font-normal text-muted-foreground">sq.m</span>
            </div>
            <div className="text-[11px] text-muted-foreground">Count: {norm.required_count} units</div>
          </div>

          <div className="space-y-1 text-right">
            <span className="text-[10px] text-muted-foreground uppercase font-medium">Available Carpet Area</span>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {norm.available_area_sqm.toLocaleString()} <span className="text-[10px] font-normal text-muted-foreground">sq.m</span>
            </div>
            <div className="text-[11px] font-medium text-primary">
              Count: {norm.available_count} units (+{areaSurplusPct}% surplus)
            </div>
          </div>
        </div>

        {/* Audit verification sign */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40 text-muted-foreground">
          <div className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Audited: {norm.audited_by}</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            Deficiency: {norm.deficiency_percentage}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
