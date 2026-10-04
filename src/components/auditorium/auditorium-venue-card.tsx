"use client";

import React from "react";
import { AuditoriumHall } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Theater, Users, MapPin, Sparkles, Volume2, Video } from "lucide-react";

interface AuditoriumVenueCardProps {
  hall: AuditoriumHall;
  onBook: (hall: AuditoriumHall) => void;
}

export function AuditoriumVenueCard({ hall, onBook }: AuditoriumVenueCardProps) {
  const isAvailable = hall.current_status === "Available";

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 via-card/50 to-background/80 p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-purple-500/50 hover:shadow-purple-500/10 hover:shadow-xl">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20 group-hover:scale-105 transition-transform">
            <Theater className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-base tracking-tight leading-tight">
              {hall.hall_name}
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              Cap: {hall.seating_capacity} Seats • {hall.stage_dimensions}
            </span>
          </div>
        </div>
        <Badge
          variant="outline"
          className={
            isAvailable
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
              : hall.current_status === "In Session"
              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
              : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30"
          }
        >
          {hall.current_status}
        </Badge>
      </div>

      <div className="space-y-2 py-2 text-xs text-muted-foreground border-y border-border/40 my-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-purple-500 shrink-0" />
          <span className="truncate">{hall.venue_building}</span>
        </div>
        <div className="flex items-center gap-2">
          <Volume2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
          <span className="truncate">{hall.acoustic_rating}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 truncate">
            <Video className="h-3.5 w-3.5 text-teal-500 shrink-0" />
            {hall.projector_type}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Users className="h-3.5 w-3.5 text-purple-500" />
          {hall.seating_capacity} Max Attendees
        </span>
        <Button
          size="sm"
          disabled={!isAvailable}
          onClick={() => onBook(hall)}
          className="bg-purple-600 hover:bg-purple-500 text-white font-medium shadow-md shadow-purple-600/20"
        >
          {isAvailable ? "Book Stage Hall" : "Unavailable"}
        </Button>
      </div>
    </div>
  );
}
