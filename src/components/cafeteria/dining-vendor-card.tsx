"use client";

import React from "react";
import { DiningVendor } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Clock, MapPin, Star, Flame, Sparkles } from "lucide-react";

interface DiningVendorCardProps {
  vendor: DiningVendor;
  onSelect: (vendor: DiningVendor) => void;
}

export function DiningVendorCard({ vendor, onSelect }: DiningVendorCardProps) {
  const isOpen = vendor.is_accepting_orders;

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 via-card/50 to-background/80 p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-amber-500/50 hover:shadow-amber-500/10 hover:shadow-xl">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-base tracking-tight leading-tight">
              {vendor.vendor_name}
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              {vendor.cuisine_type}
            </span>
          </div>
        </div>
        <Badge
          variant="outline"
          className={
            isOpen
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
              : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30"
          }
        >
          {isOpen ? "Kitchen Open" : "Closed"}
        </Badge>
      </div>

      <div className="space-y-2 py-2 text-xs text-muted-foreground border-y border-border/40 my-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          <span className="truncate">{vendor.location_stall}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-blue-500" />
            Hours: {vendor.opening_time.substring(0, 5)} - {vendor.closing_time.substring(0, 5)}
          </span>
          <span className="flex items-center gap-1 font-semibold text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-500" /> {vendor.rating.toFixed(1)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-orange-500" />
            Avg. Prep: <strong className="text-foreground">{vendor.average_prep_time_mins} mins</strong>
          </span>
          <span className="flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
            <Sparkles className="h-3 w-3" /> Digital Pay Ready
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-muted-foreground">Contactless Pre-Order</span>
        <Button
          size="sm"
          disabled={!isOpen}
          onClick={() => onSelect(vendor)}
          className="bg-amber-600 hover:bg-amber-500 text-white font-medium shadow-md shadow-amber-600/20"
        >
          {isOpen ? "Order Meals" : "Closed"}
        </Button>
      </div>
    </div>
  );
}
