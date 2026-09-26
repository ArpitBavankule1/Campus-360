"use client";

import { useState } from "react";
import {
  CAMPUS_FACILITY_TELEMETRY,
  getAggregateCampusMetrics,
  type FacilityTelemetry,
} from "@/lib/analytics/campus-telemetry";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Zap, Building, Activity } from "lucide-react";
import { cn } from "cn";

export function CampusTelemetryWidget() {
  const [telemetry] = useState<FacilityTelemetry[]>(CAMPUS_FACILITY_TELEMETRY);
  const metrics = getAggregateCampusMetrics();

  return (
    <div className="space-y-4">
      {/* High level metrics banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border shadow-xs bg-card/80">
          <CardContent className="p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-medium">Campus Occupancy</p>
              <p className="text-base font-bold">{metrics.totalOccupancy} / {metrics.totalCapacity}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-xs bg-card/80">
          <CardContent className="p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-medium">Average Load</p>
              <p className="text-base font-bold">{metrics.averageOccupancyPercentage}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-xs bg-card/80">
          <CardContent className="p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-medium">Power Grid</p>
              <p className="text-base font-bold">{metrics.totalPowerConsumptionKw} kW</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-xs bg-card/80">
          <CardContent className="p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-medium">Spaces Tracked</p>
              <p className="text-base font-bold">{metrics.monitoredFacilitiesCount} Facilities</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Facilities Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {telemetry.map((f) => (
          <div key={f.id} className="p-3.5 rounded-2xl border bg-card/60 flex items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">{f.name}</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] px-1.5 py-0 font-semibold",
                    f.status === "available"
                      ? "text-emerald-600 border-emerald-500/20"
                      : f.status === "near_capacity"
                      ? "text-rose-600 border-rose-500/20"
                      : "text-amber-600 border-amber-500/20"
                  )}
                >
                  {f.occupancyPercentage}% full
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {f.currentOccupancy} of {f.capacity} seats active • {f.powerEfficiencyKw} kW load
              </p>
            </div>
            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden shrink-0">
              <div
                className={cn(
                  "h-full rounded-full",
                  f.occupancyPercentage > 80
                    ? "bg-rose-500"
                    : f.occupancyPercentage > 50
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                )}
                style={{ width: `${f.occupancyPercentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
