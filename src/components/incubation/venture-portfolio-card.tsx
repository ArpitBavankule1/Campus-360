"use client";

import React from "react";
import { IncubationVenture } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rocket, FileText, Award, DollarSign, ExternalLink } from "lucide-react";

interface VenturePortfolioCardProps {
  venture: IncubationVenture;
  onBookPitch: (venture: IncubationVenture) => void;
}

export function VenturePortfolioCard({
  venture,
  onBookPitch,
}: VenturePortfolioCardProps) {
  return (
    <div className="relative group overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 via-card/50 to-background/80 p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-violet-500/50 hover:shadow-violet-500/10 hover:shadow-xl">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500 border border-violet-500/20 group-hover:scale-105 transition-transform">
            <Rocket className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-base tracking-tight leading-tight">
              {venture.venture_name}
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              {venture.sector} • {venture.founder_role}
            </span>
          </div>
        </div>
        <Badge
          variant="outline"
          className="bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30 font-medium"
        >
          {venture.stage}
        </Badge>
      </div>

      <div className="space-y-2 py-2 text-xs text-muted-foreground border-y border-border/40 my-3">
        <div className="flex items-center justify-between">
          <span>Founders: <strong className="text-foreground">{venture.founder_name}</strong></span>
          <span className="flex items-center gap-1 text-emerald-500 font-semibold text-xs">
            <DollarSign className="h-3.5 w-3.5" /> ₹{(venture.valuation_inr / 10000000).toFixed(1)} Cr Valuation
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Seed Grant: <strong className="text-foreground">₹{venture.seed_grant_inr.toLocaleString()}</strong></span>
          <span className="flex items-center gap-1 text-amber-500 font-medium">
            <Award className="h-3.5 w-3.5" /> {venture.patents_filed} Patents Filed
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        {venture.pitch_deck_url ? (
          <a
            href={venture.pitch_deck_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-violet-500 hover:text-violet-400 font-medium"
          >
            <FileText className="h-3.5 w-3.5" /> Pitch Deck <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-xs text-muted-foreground">Deck Confidential</span>
        )}
        <Button
          size="sm"
          onClick={() => onBookPitch(venture)}
          className="bg-violet-600 hover:bg-violet-500 text-white font-medium shadow-md shadow-violet-600/20"
        >
          Book Pitch Slot
        </Button>
      </div>
    </div>
  );
}
