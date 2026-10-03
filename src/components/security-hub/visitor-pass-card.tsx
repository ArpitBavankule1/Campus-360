"use client";

import React from "react";
import { VisitorPass } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, User, Calendar, MapPin, QrCode } from "lucide-react";

interface VisitorPassCardProps {
  pass: VisitorPass;
  onViewBadge: (pass: VisitorPass) => void;
}

export function VisitorPassCard({ pass, onViewBadge }: VisitorPassCardProps) {
  const isCheckedIn = pass.status === "Checked In";

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 via-card/50 to-background/80 p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-amber-500/50 hover:shadow-amber-500/10 hover:shadow-xl">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-base tracking-tight leading-tight">
              {pass.visitor_name}
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              Pass: {pass.pass_code}
            </span>
          </div>
        </div>
        <Badge
          variant="outline"
          className={
            isCheckedIn
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
              : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
          }
        >
          {pass.status}
        </Badge>
      </div>

      <div className="space-y-2 py-2 text-xs text-muted-foreground border-y border-border/40 my-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-amber-500" />
            Host: <strong className="text-foreground">{pass.host_person}</strong>
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-blue-500" />
            {pass.valid_date}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          <span className="truncate">{pass.entry_gate}</span>
        </div>
        <div className="text-[11px] text-foreground/80 line-clamp-1">
          Purpose: <strong>{pass.visiting_purpose}</strong>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-muted-foreground font-mono">
          {pass.vehicle_number ? `Veh: ${pass.vehicle_number}` : "Pedestrian Access"}
        </span>
        <Button
          size="sm"
          onClick={() => onViewBadge(pass)}
          className="bg-amber-600 hover:bg-amber-500 text-white font-medium shadow-md shadow-amber-600/20"
        >
          <QrCode className="mr-1.5 h-3.5 w-3.5" /> View Gate QR
        </Button>
      </div>
    </div>
  );
}
