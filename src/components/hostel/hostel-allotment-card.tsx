"use client";

import React from "react";
import { HostelAllocation, HostelRoom, HostelBlock } from "@/types";
import {
  Building2,
  Bed,
  CheckCircle2,
  Shield,
  Zap,
  Wifi,
  Calendar,
  IndianRupee,
  Layers,
} from "lucide-react";

interface HostelAllotmentCardProps {
  allocation: HostelAllocation;
  room?: HostelRoom;
  block?: HostelBlock;
}

export function HostelAllotmentCard({
  allocation,
  room,
  block,
}: HostelAllotmentCardProps) {
  const currentRoom = room || allocation.room;
  const currentBlock = block || currentRoom?.block;

  return (
    <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card/90 to-primary/5 p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/40 relative overflow-hidden">
      {/* Background decorative glow */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      {/* Header with status badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {currentBlock?.name || "Aryabhata Hall of Residence"}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <span>Academic Session {allocation.academic_year}</span>
              <span>•</span>
              <span className="capitalize">{currentBlock?.gender || "Boys"} Hostel</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified Resident
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
            {allocation.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Room Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-5">
        <div className="p-3 rounded-2xl bg-muted/40 border border-border/40">
          <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-primary" />
            Room & Floor
          </div>
          <div className="text-lg font-bold text-foreground mt-1">
            {currentRoom?.room_number || "A-204"}
          </div>
          <div className="text-[11px] text-muted-foreground">
            Floor {currentRoom?.floor || 2}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-muted/40 border border-border/40">
          <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Bed className="w-3.5 h-3.5 text-primary" />
            Allocated Bed
          </div>
          <div className="text-lg font-bold text-foreground mt-1">
            {allocation.bed_number}
          </div>
          <div className="text-[11px] text-muted-foreground capitalize">
            {currentRoom?.room_type || "Double"} Occupancy
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-muted/40 border border-border/40">
          <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Air Conditioning
          </div>
          <div className="text-lg font-bold text-foreground mt-1">
            {currentRoom?.ac_enabled ? "AC Room" : "Non-AC"}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {currentRoom?.ac_enabled ? "Sub-metered" : "Cross-ventilated"}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-muted/40 border border-border/40">
          <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-500" />
            Monthly Rent
          </div>
          <div className="text-lg font-bold text-foreground mt-1">
            ₹{currentRoom?.monthly_rent?.toLocaleString() || "6,500"}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Mess Included
          </div>
        </div>
      </div>

      {/* Amenities & Allotment Date */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/40 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-muted-foreground font-medium mr-1">In-Room Amenities:</span>
          {(currentRoom?.amenities || ["Bed", "Study Table", "Wardrobe", "Gigabit LAN"]).map((amenity, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-lg bg-background border border-border/60 text-muted-foreground capitalize flex items-center gap-1 text-[11px]"
            >
              {amenity.includes("lan") || amenity.includes("wifi") ? (
                <Wifi className="w-2.5 h-2.5 text-primary" />
              ) : null}
              {amenity.replace("_", " ")}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="w-3.5 h-3.5 text-primary/70" />
          <span>Allotted on {new Date(allocation.allocated_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
