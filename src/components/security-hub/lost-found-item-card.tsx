"use client";

import React from "react";
import { LostAndFoundItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HelpCircle, MapPin, Calendar, CheckCircle } from "lucide-react";

interface LostFoundItemCardProps {
  item: LostAndFoundItem;
  onClaim: (item: LostAndFoundItem) => void;
}

export function LostFoundItemCard({ item, onClaim }: LostFoundItemCardProps) {
  const isUnclaimed = item.status === "Unclaimed";

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 via-card/50 to-background/80 p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-sky-500/50 hover:shadow-sky-500/10 hover:shadow-xl">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 border border-sky-500/20 group-hover:scale-105 transition-transform">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-base tracking-tight leading-tight">
              {item.title}
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              {item.category} • Code: {item.item_code}
            </span>
          </div>
        </div>
        <Badge
          variant="outline"
          className={
            isUnclaimed
              ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30"
              : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
          }
        >
          {item.status}
        </Badge>
      </div>

      <div className="space-y-2 py-2 text-xs text-muted-foreground border-y border-border/40 my-3">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-sky-500 shrink-0" />
          <span className="truncate">Found: {item.found_location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-blue-500 shrink-0" />
          <span>Reported: {new Date(item.reported_at).toLocaleString()}</span>
        </div>
        <p className="line-clamp-2 text-[11px] leading-relaxed text-foreground/80 pt-1">
          {item.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-muted-foreground">Logged by: {item.reported_by}</span>
        <Button
          size="sm"
          disabled={!isUnclaimed}
          onClick={() => onClaim(item)}
          className="bg-sky-600 hover:bg-sky-500 text-white font-medium shadow-md shadow-sky-600/20"
        >
          {isUnclaimed ? (
            "Claim Item"
          ) : (
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> Under Review
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
