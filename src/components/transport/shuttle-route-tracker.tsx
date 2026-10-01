"use client";

import React from "react";
import { TransportRoute, TransportSchedule } from "@/types";
import {
  Bus,
  Clock,
  MapPin,
  Phone,
  Sparkles,
  Zap,
  Navigation,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShuttleRouteTrackerProps {
  route: TransportRoute;
  schedule?: TransportSchedule | null;
  onBookPass?: (route: TransportRoute) => void;
}

export function ShuttleRouteTracker({
  route,
  schedule,
  onBookPass,
}: ShuttleRouteTrackerProps) {
  const isEV = route.shuttle_type === "electric_bus";

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm space-y-4 transition-all hover:border-primary/40 hover:shadow-md flex flex-col justify-between">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                {isEV && <Zap className="w-2.5 h-2.5 fill-current" />}
                {route.route_code}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">
                Every {route.frequency_mins} mins
              </span>
            </div>
            <h4 className="text-base font-bold text-foreground mt-1">
              {route.route_name}
            </h4>
          </div>

          <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Bus className="w-5 h-5" />
          </div>
        </div>

        {/* Live GPS Telemetry Pill */}
        {schedule ? (
          <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live: {schedule.bus_number}
              </span>
              <span className="font-bold text-foreground bg-card/80 px-2 py-0.5 rounded-lg border border-border/50 text-[11px]">
                ETA: {schedule.live_eta_mins} mins
              </span>
            </div>

            <p className="text-[11px] text-muted-foreground">
              Current stop: <span className="font-medium text-foreground">{schedule.current_stop}</span>
            </p>

            <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-emerald-500/10">
              <span>Driver: {schedule.driver_name}</span>
              <span className="flex items-center gap-1">
                <Phone className="w-2.5 h-2.5" /> {schedule.driver_phone}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-muted/50 border border-border/60 text-xs text-muted-foreground flex items-center justify-between">
            <span>Operating: {route.operating_hours}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary">
              STANDBY
            </span>
          </div>
        )}

        {/* Route Stops Stepper */}
        <div className="space-y-2 pt-1">
          <p className="text-[11px] font-semibold text-muted-foreground">
            Key Shuttle Route Waypoints
          </p>
          <div className="space-y-1.5 pl-2 border-l-2 border-primary/30 ml-2">
            {route.stops.map((stop, idx) => (
              <div key={idx} className="relative flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="absolute -left-[13px] h-2 w-2 rounded-full bg-primary" />
                  <span className="text-foreground font-medium">{stop.name}</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">
                  +{stop.eta_mins}m
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="pt-3 border-t border-border/50 flex gap-2">
        <Button
          size="sm"
          className="w-full rounded-xl text-xs gap-1.5"
          onClick={() => onBookPass?.(route)}
        >
          <Navigation className="w-3.5 h-3.5" />
          Get Bus Pass for {route.route_code}
        </Button>
      </div>
    </div>
  );
}
