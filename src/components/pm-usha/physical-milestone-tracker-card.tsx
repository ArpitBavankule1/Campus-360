"use client";

import React from "react";
import { PmUshaPhysicalMilestone, PmUshaInspectionStatus } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Compass,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  Hammer,
  Cpu,
  Monitor,
  Sun,
  Camera,
  Calendar,
} from "lucide-react";

interface PhysicalMilestoneTrackerCardProps {
  milestones: PmUshaPhysicalMilestone[];
}

export function PhysicalMilestoneTrackerCard({
  milestones,
}: PhysicalMilestoneTrackerCardProps) {
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Civil_Works":
        return <Hammer className="h-4 w-4 text-amber-400" />;
      case "Lab_Modernization":
        return <Cpu className="h-4 w-4 text-purple-400" />;
      case "Smart_Classrooms":
        return <Monitor className="h-4 w-4 text-blue-400" />;
      case "Solar_Green_Energy":
        return <Sun className="h-4 w-4 text-emerald-400" />;
      default:
        return <Compass className="h-4 w-4 text-cyan-400" />;
    }
  };

  const getInspectionBadge = (status: PmUshaInspectionStatus) => {
    switch (status) {
      case "Certified":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Certified
          </Badge>
        );
      case "Inspected_Satisfactory":
        return (
          <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/30 text-[10px] font-semibold flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Satisfactory
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px] font-semibold flex items-center gap-1">
            <Clock className="h-3 w-3" /> Inspection Due
          </Badge>
        );
      case "Deficiency_Noted":
        return (
          <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/30 text-[10px] font-semibold flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Rectification Req.
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="border-border/60 bg-card/60 shadow-sm">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
              <Compass className="h-5 w-5 text-emerald-400" />
              Physical & Financial Milestone Tracker (Geo-Tagged)
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Live civil construction, lab setups and energy infrastructure progress validated with site GPS coordinates
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {milestones.map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-xl border border-border/50 bg-background/50 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-muted/60 border border-border/40">
                      {getCategoryIcon(m.work_category)}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {m.milestone_code}
                      </span>
                      <h4 className="text-xs sm:text-sm font-semibold text-foreground line-clamp-1">
                        {m.milestone_name}
                      </h4>
                    </div>
                  </div>
                  {getInspectionBadge(m.site_inspection_status)}
                </div>

                {/* Progress Gauges */}
                <div className="space-y-2 pt-1">
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1 font-medium">
                      <span className="text-muted-foreground">Physical Completion</span>
                      <span className="text-emerald-400 font-bold">
                        {m.physical_progress_percentage}%
                      </span>
                    </div>
                    <Progress value={m.physical_progress_percentage} className="h-1.5 bg-muted" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1 font-medium">
                      <span className="text-muted-foreground">Financial Absorption</span>
                      <span className="text-cyan-400 font-bold">
                        {m.financial_progress_percentage}%
                      </span>
                    </div>
                    <Progress value={m.financial_progress_percentage} className="h-1.5 bg-muted" />
                  </div>
                </div>

                {/* Geo-tag & Inspector Details */}
                <div className="pt-2 border-t border-border/40 text-[11px] text-muted-foreground space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-emerald-400/90 font-mono text-[10px]">
                      <MapPin className="h-3 w-3" />
                      GPS: {m.geo_latitude?.toFixed(4)}, {m.geo_longitude?.toFixed(4)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Target: {m.target_date}
                    </span>
                  </div>

                  {m.inspector_designation && (
                    <p className="text-[10px] text-muted-foreground italic">
                      Inspected by: {m.inspector_designation} ({m.inspection_date})
                    </p>
                  )}
                </div>
              </div>

              {m.geo_tag_photo_url && (
                <div className="mt-3 pt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <Camera className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Geo-Tagged Photographic Evidence Archived on PMU Portal</span>
                </div>
              )}
            </div>
          ))}

          {milestones.length === 0 && (
            <div className="col-span-full py-8 text-center text-muted-foreground">
              <Compass className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No physical milestones recorded yet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
