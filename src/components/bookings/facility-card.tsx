"use client";

import React from "react";
import {
  Building2,
  Users,
  Clock,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { CampusSpace } from "@/lib/bookings/booking-engine";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FacilityCardProps {
  space: CampusSpace;
  onBook: (space: CampusSpace) => void;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({ space, onBook }) => {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge
            variant="outline"
            className="text-[11px] font-medium border-primary/30 text-primary bg-primary/5"
          >
            {space.categoryLabel}
          </Badge>

          {space.requiresApproval ? (
            <Badge
              variant="outline"
              className="text-[10px] gap-1 border-amber-500/30 text-amber-500 bg-amber-500/5 font-medium"
            >
              <ShieldAlert className="w-3 h-3" /> Requires Approval
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-[10px] gap-1 border-emerald-500/30 text-emerald-500 bg-emerald-500/5 font-medium"
            >
              <ShieldCheck className="w-3 h-3" /> Instant Confirmation
            </Badge>
          )}
        </div>

        {/* Space Title & Location */}
        <h3 className="font-semibold text-lg text-foreground tracking-tight group-hover:text-primary transition-colors">
          {space.name}
        </h3>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1.5 mb-3">
          <span className="flex items-center gap-1 font-medium text-foreground/80">
            <Building2 className="w-3.5 h-3.5 text-primary/70" />
            {space.building}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground/70" />
            {space.floor}, {space.roomNumber}
          </span>
        </div>

        {/* Meta Stats Row */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-muted/30 border border-border/40 text-xs mb-3.5">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="w-3.5 h-3.5 text-primary/80" />
            <span>Capacity:</span>
            <strong className="text-foreground">{space.capacity} {space.capacity === 1 ? "person" : "people"}</strong>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-3.5 h-3.5 text-primary/80" />
            <span>Hours:</span>
            <strong className="text-foreground truncate">{space.timings}</strong>
          </div>
        </div>

        {/* Amenities Chips */}
        <div className="space-y-1.5 mb-4">
          <span className="text-[11px] font-medium text-muted-foreground">Included Amenities:</span>
          <div className="flex flex-wrap gap-1.5">
            {space.amenities.map((amenity, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/60 text-[10px] text-foreground/80 border border-border/30"
              >
                <Sparkles className="w-2.5 h-2.5 text-primary/60" />
                {amenity}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-border/40 flex items-center justify-between gap-3">
        <div className="text-[11px] text-muted-foreground">
          In-Charge: <span className="font-medium text-foreground/90">{space.inCharge}</span>
        </div>

        <Button
          size="sm"
          onClick={() => onBook(space)}
          className="gap-1.5 text-xs font-semibold shadow-sm hover:shadow group-hover:bg-primary transition-all"
        >
          <span>Reserve Space</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
    </div>
  );
};
