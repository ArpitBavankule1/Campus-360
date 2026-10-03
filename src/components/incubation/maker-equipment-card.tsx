"use client";

import React from "react";
import { MakerSpaceEquipment } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cpu, MapPin, Clock, Wrench } from "lucide-react";

interface MakerEquipmentCardProps {
  equipment: MakerSpaceEquipment;
  onReserveWorkbench: (equipment: MakerSpaceEquipment) => void;
}

export function MakerEquipmentCard({
  equipment,
  onReserveWorkbench,
}: MakerEquipmentCardProps) {
  return (
    <div className="relative group overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 via-card/50 to-background/80 p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-cyan-500/50 hover:shadow-cyan-500/10 hover:shadow-xl">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 group-hover:scale-105 transition-transform">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-base tracking-tight leading-tight">
              {equipment.equipment_name}
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              {equipment.equipment_type}
            </span>
          </div>
        </div>
        <Badge
          variant="outline"
          className={
            equipment.is_operational
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
              : "bg-destructive/15 text-destructive border-destructive/30"
          }
        >
          {equipment.is_operational ? "Operational" : "Maintenance"}
        </Badge>
      </div>

      <div className="space-y-2 py-2 text-xs text-muted-foreground border-y border-border/40 my-3">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
          <span className="truncate">{equipment.location_lab}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-blue-500 shrink-0" />
          <span>Capacity: {equipment.hourly_slot_capacity} simultaneous founder teams</span>
        </div>
        <div className="flex items-start gap-1.5 pt-1">
          <Wrench className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
          <span className="line-clamp-2 text-[11px] leading-relaxed text-foreground/80">
            {equipment.specs_summary}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-muted-foreground">Prototyping Grant Access</span>
        <Button
          size="sm"
          disabled={!equipment.is_operational}
          onClick={() => onReserveWorkbench(equipment)}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium shadow-md shadow-cyan-600/20"
        >
          Reserve Workbench
        </Button>
      </div>
    </div>
  );
}
