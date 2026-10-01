"use client";

import React from "react";
import { InnovationStartup } from "@/types";
import {
  Rocket,
  ExternalLink,
  DollarSign,
  Building2,
  Users,
  Sparkles,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface StartupShowcaseCardProps {
  startup: InnovationStartup;
}

export function StartupShowcaseCard({ startup }: StartupShowcaseCardProps) {
  const getSectorBadge = () => {
    switch (startup.sector) {
      case "Robotics":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "HealthTech":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case "CleanTech":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      default:
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    }
  };

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm space-y-4 transition-all hover:border-primary/40 hover:shadow-md flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getSectorBadge()}`}
            >
              {startup.sector}
            </span>
            <h4 className="text-base font-bold text-foreground mt-1">
              {startup.startup_name}
            </h4>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
            {startup.funding_stage}
          </span>
        </div>

        <p className="text-xs text-primary font-medium">
          Founded by: {startup.founder_name} ({startup.founder_role})
        </p>

        <p className="text-xs text-muted-foreground/90 line-clamp-3 leading-relaxed">
          {startup.description}
        </p>

        <div className="p-3 rounded-2xl bg-muted/40 border border-border/40 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Seed Grant Awarded</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              ₹{(startup.seed_grant_awarded / 100000).toFixed(1)} Lakhs
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Incubation Bay</span>
            <span>{startup.incubation_space}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2">
        {startup.website_url ? (
          <a
            href={startup.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Visit Website
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-[11px] text-muted-foreground">Incubated Venture</span>
        )}

        {startup.pitch_deck_url && (
          <a
            href={startup.pitch_deck_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all"
          >
            <FileText className="w-3 h-3" />
            Pitch Deck
          </a>
        )}
      </div>
    </div>
  );
}
