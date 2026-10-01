"use client";

import React from "react";
import { WaterMetric } from "@/types";
import {
  Droplets,
  Activity,
  CheckCircle2,
  Recycle,
} from "lucide-react";

interface WaterResourceCardProps {
  metric: WaterMetric;
}

export function WaterResourceCard({ metric }: WaterResourceCardProps) {
  const percentageReserve = Math.round(
    (metric.current_reserve_kiloliters / metric.capacity_kiloliters) * 100
  );

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm space-y-4 transition-all hover:border-primary/40 hover:shadow-md flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground leading-snug line-clamp-1">
                {metric.reservoir_name}
              </h3>
              <div className="text-[10px] text-muted-foreground font-mono">
                Capacity: {metric.capacity_kiloliters} kL
              </div>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-mono">
            {percentageReserve}% Full
          </span>
        </div>

        {/* Reserve Level Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Current Reserve Level</span>
            <span className="font-mono font-bold text-foreground">
              {metric.current_reserve_kiloliters} kL ({percentageReserve}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${Math.min(percentageReserve, 100)}%` }}
            />
          </div>
        </div>

        {/* Quality and Recycling Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-muted/50 border border-border/40 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
              <Recycle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Greywater Recycled</span>
            </div>
            <div className="font-bold font-mono text-foreground text-sm">
              {(metric.greywater_recycled_liters_today / 1000).toFixed(1)} kL / day
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-muted/50 border border-border/40 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
              <Activity className="w-3.5 h-3.5 text-cyan-500" />
              <span>Water Quality (WQI)</span>
            </div>
            <div className="font-bold font-mono text-foreground text-sm flex items-center gap-1">
              <span>{metric.water_quality_index.toFixed(1)}</span>
              <span className="text-[10px] text-emerald-500 font-semibold">(Pure)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>pH: {metric.ph_level.toFixed(1)} • TDS: {metric.tds_ppm} ppm</span>
        </span>
        <span className="text-[10px] font-mono">Sensors Online</span>
      </div>
    </div>
  );
}
