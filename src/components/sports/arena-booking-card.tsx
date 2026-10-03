"use client";

import React from "react";
import { SportsArena } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, MapPin, Zap, Flame } from "lucide-react";

interface ArenaBookingCardProps {
  arena: SportsArena;
  onReserve: (arena: SportsArena) => void;
}

export function ArenaBookingCard({ arena, onReserve }: ArenaBookingCardProps) {
  const isAvailable = arena.current_status === "Available";

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 via-card/50 to-background/80 p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-emerald-500/50 hover:shadow-emerald-500/10 hover:shadow-xl">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 group-hover:scale-105 transition-transform">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-base tracking-tight leading-tight">
              {arena.arena_name}
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              {arena.sport_type} • {arena.total_courts} {arena.total_courts === 1 ? "Court" : "Courts"}
            </span>
          </div>
        </div>
        <Badge
          variant="outline"
          className={
            isAvailable
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
              : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
          }
        >
          {arena.current_status}
        </Badge>
      </div>

      <div className="space-y-2 py-2 text-xs text-muted-foreground border-y border-border/40 my-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          <span className="truncate">{arena.location_venue}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-blue-500 shrink-0" />
          <span>Hours: {arena.opening_time.substring(0, 5)} - {arena.closing_time.substring(0, 5)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-orange-500" />
            Surface: <strong className="text-foreground">{arena.court_surface}</strong>
          </span>
          {arena.is_floodlit && (
            <span className="flex items-center gap-1 text-[11px] text-amber-500 font-medium">
              <Zap className="h-3 w-3" /> Floodlit Night Play
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xs text-muted-foreground">Booking Fee</span>
          <p className="text-sm font-bold text-foreground">
            {arena.hourly_rate === 0 ? "Free for Scholars" : `₹${arena.hourly_rate}/hr`}
          </p>
        </div>
        <Button
          size="sm"
          disabled={!isAvailable}
          onClick={() => onReserve(arena)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-md shadow-emerald-600/20"
        >
          {isAvailable ? "Reserve Slot" : "Full"}
        </Button>
      </div>
    </div>
  );
}
