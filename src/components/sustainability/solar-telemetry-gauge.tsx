"use client";

import React from "react";
import { SolarTelemetry } from "@/types";
import {
  Sun,
  BatteryCharging,
  Zap,
  Leaf,
  ArrowUpRight,
} from "lucide-react";

interface SolarTelemetryGaugeProps {
  telemetry: SolarTelemetry;
}

export function SolarTelemetryGauge({ telemetry }: SolarTelemetryGaugeProps) {
  const percentageOfPeak = Math.round(
    (telemetry.current_generation_kw / telemetry.peak_capacity_kwp) * 100
  );

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm space-y-4 transition-all hover:border-primary/40 hover:shadow-md flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground leading-snug">
                {telemetry.array_zone}
              </h3>
              <div className="text-[10px] text-muted-foreground font-mono">
                Rooftop Solar PV Array
              </div>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono">
            {percentageOfPeak}% Active
          </span>
        </div>

        {/* Current Generation Display */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-card border border-amber-500/20 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Current Generation
            </div>
            <div className="text-xl font-extrabold text-foreground font-mono tracking-tight flex items-baseline gap-1 mt-0.5">
              <span>{telemetry.current_generation_kw.toFixed(1)}</span>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">kW</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Peak Capacity
            </div>
            <div className="text-sm font-semibold text-foreground font-mono">
              {telemetry.peak_capacity_kwp.toFixed(0)} kWp
            </div>
          </div>
        </div>

        {/* Battery & Grid Export Telemetry */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-muted/50 border border-border/40 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
              <span>Microgrid Battery</span>
            </div>
            <div className="font-bold font-mono text-foreground text-sm">
              {telemetry.battery_storage_percent}% Charged
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-muted/50 border border-border/40 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
              <Zap className="w-3.5 h-3.5 text-blue-500" />
              <span>Grid Export</span>
            </div>
            <div className="font-bold font-mono text-foreground text-sm flex items-center">
              <span>{telemetry.grid_export_kw.toFixed(1)} kW</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500 ml-0.5" />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
          <Leaf className="w-3.5 h-3.5" />
          <span>{telemetry.carbon_offset_kg.toFixed(0)} kg CO₂ Saved</span>
        </span>
        <span className="font-mono text-[11px]">
          Today: <strong className="text-foreground">{telemetry.daily_total_kwh.toFixed(0)} kWh</strong>
        </span>
      </div>
    </div>
  );
}
