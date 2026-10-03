"use client";

import React from "react";
import { AthleticLeague } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Award, Shield } from "lucide-react";

interface AthleticMatchCardProps {
  league: AthleticLeague;
  onRegisterTeam: (league: AthleticLeague) => void;
}

export function AthleticMatchCard({ league, onRegisterTeam }: AthleticMatchCardProps) {
  const isOpen = league.status === "Registration Open";

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 via-card/50 to-background/80 p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-blue-500/50 hover:shadow-blue-500/10 hover:shadow-xl">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 group-hover:scale-105 transition-transform">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-base tracking-tight leading-tight">
              {league.tournament_title}
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              {league.sport_type} • Season {league.season_year}
            </span>
          </div>
        </div>
        <Badge
          variant="outline"
          className={
            isOpen
              ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30"
              : "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30"
          }
        >
          {league.status}
        </Badge>
      </div>

      <div className="space-y-2 py-2 text-xs text-muted-foreground border-y border-border/40 my-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-blue-500" />
            Dates: <strong className="text-foreground">{league.start_date} to {league.end_date}</strong>
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-indigo-500" />
            {league.participating_teams} Squads
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="truncate">Org: {league.organizer_department}</span>
          <span className="flex items-center gap-1 text-amber-500 font-semibold text-xs">
            <Award className="h-3.5 w-3.5" /> ₹{league.prize_pool_inr.toLocaleString()} Prize Pool
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-muted-foreground">Official Apex Varsity League</span>
        <Button
          size="sm"
          disabled={!isOpen}
          onClick={() => onRegisterTeam(league)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-md shadow-blue-600/20"
        >
          {isOpen ? "Register Squad" : "View Bracket"}
        </Button>
      </div>
    </div>
  );
}
