"use client";

import React from "react";
import { NirfBenchmarkPeer } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Trophy, TrendingUp } from "lucide-react";

interface PeerBenchmarkCardProps {
  peer: NirfBenchmarkPeer;
  isCurrentCampus?: boolean;
}

export function PeerBenchmarkCard({
  peer,
  isCurrentCampus = false,
}: PeerBenchmarkCardProps) {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "IIT":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30";
      case "NIT":
        return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30";
      case "BITS":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
      case "IIIT":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30";
      case "Apex_Institute":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <Card
      className={`transition-all duration-200 border-border/80 ${
        isCurrentCampus
          ? "ring-2 ring-primary/40 bg-primary/5 shadow-md"
          : "hover:shadow-md bg-card"
      }`}
    >
      <CardHeader className="pb-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="outline" className={`font-semibold ${getTypeBadge(peer.institute_type)}`}>
            {peer.institute_type.replace("_", " ")}
          </Badge>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-muted-foreground">Rank</span>
            <Badge
              variant={isCurrentCampus ? "default" : "secondary"}
              className="font-bold text-xs"
            >
              #{peer.current_rank}
            </Badge>
          </div>
        </div>

        <CardTitle className="text-base font-bold mt-1 text-foreground flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary shrink-0" />
          {peer.institute_name}
        </CardTitle>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
          <span>{peer.city}, {peer.state}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-1 text-xs">
        <div className="flex justify-between items-center bg-muted/40 p-2.5 rounded-lg border border-border/50">
          <div>
            <span className="text-[11px] text-muted-foreground block">Composite NIRF Score:</span>
            <span className="text-lg font-black text-foreground">
              {peer.composite_score.toFixed(2)} <span className="text-xs font-normal text-muted-foreground">/ 100</span>
            </span>
          </div>
          <Trophy className="w-6 h-6 text-amber-500 shrink-0" />
        </div>

        {/* Breakdown chips */}
        <div className="grid grid-cols-5 gap-1 text-center font-mono text-[11px]">
          <div className="bg-background p-1.5 rounded border border-border/60">
            <span className="text-muted-foreground block text-[9px]">TLR</span>
            <span className="font-bold text-foreground">{peer.tlr_score.toFixed(1)}</span>
          </div>
          <div className="bg-background p-1.5 rounded border border-border/60">
            <span className="text-muted-foreground block text-[9px]">RPC</span>
            <span className="font-bold text-foreground">{peer.rpc_score.toFixed(1)}</span>
          </div>
          <div className="bg-background p-1.5 rounded border border-border/60">
            <span className="text-muted-foreground block text-[9px]">GO</span>
            <span className="font-bold text-foreground">{peer.go_score.toFixed(1)}</span>
          </div>
          <div className="bg-background p-1.5 rounded border border-border/60">
            <span className="text-muted-foreground block text-[9px]">OI</span>
            <span className="font-bold text-foreground">{peer.oi_score.toFixed(1)}</span>
          </div>
          <div className="bg-background p-1.5 rounded border border-border/60">
            <span className="text-muted-foreground block text-[9px]">PR</span>
            <span className="font-bold text-foreground">{peer.pr_score.toFixed(1)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
