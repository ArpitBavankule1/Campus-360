"use client";

import React from "react";
import { IndustryLab } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Cpu,
  MapPin,
  Users,
  Server,
  Zap,
  CheckCircle,
} from "lucide-react";

interface IndustryLabCardProps {
  lab: IndustryLab;
}

export function IndustryLabCard({ lab }: IndustryLabCardProps) {
  const getAccessBadge = (access: string) => {
    switch (access) {
      case "research_fellows_only":
        return { label: "Research Fellows Only", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30" };
      case "students_and_faculty":
        return { label: "Students & Faculty", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" };
      case "restricted_clearance":
        return { label: "Restricted Clearance", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30" };
      default:
        return { label: "Open Campus", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30" };
    }
  };

  const badgeInfo = getAccessBadge(lab.access_tier);

  return (
    <Card className="border border-border/60 bg-card/60 backdrop-blur-md shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/40 bg-muted/15">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={`text-xs font-semibold ${badgeInfo.color}`}>
                {badgeInfo.label}
              </Badge>
              <Badge variant="secondary" className="text-xs font-medium text-emerald-600 bg-emerald-500/10">
                <CheckCircle className="w-3 h-3 mr-1" />
                {lab.status}
              </Badge>
            </div>
            <CardTitle className="text-base font-bold tracking-tight text-foreground flex items-center gap-2 mt-1">
              <Cpu className="w-5 h-5 text-primary shrink-0" />
              {lab.lab_name}
            </CardTitle>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" /> Co-Branded with <strong>{lab.industry_partner}</strong>
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4 text-sm">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
          <span>{lab.facility_location}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs bg-muted/30 p-2.5 rounded-lg border border-border/40">
          <div>
            <span className="text-muted-foreground block text-[11px]">Compute Allocation</span>
            <span className="font-semibold text-primary flex items-center gap-1 mt-0.5">
              <Server className="w-3.5 h-3.5" />
              {lab.compute_quota_teraflops} TFLOPS
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Active Scholars</span>
            <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
              <Users className="w-3.5 h-3.5 text-muted-foreground" />
              {lab.active_scholars} Fellows
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1">
            Sponsored Facility Hardware:
          </span>
          <ul className="text-xs space-y-1 text-muted-foreground list-disc list-inside">
            {lab.sponsored_equipment.map((eq, i) => (
              <li key={i} className="line-clamp-1">{eq}</li>
            ))}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-3 border-t border-border/40 bg-muted/10 text-xs text-muted-foreground flex justify-between items-center">
        <span>Director: <strong>{lab.lab_director}</strong></span>
        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-mono font-bold">
          High-Performance Tier
        </span>
      </CardFooter>
    </Card>
  );
}
