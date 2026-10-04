"use client";

import React from "react";
import { EventTicket } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Ticket, QrCode, MapPin, CheckCircle2, Clock } from "lucide-react";

interface EventTicketCardProps {
  ticket: EventTicket;
}

export function EventTicketCard({ ticket }: EventTicketCardProps) {
  return (
    <div className="relative group overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 via-card/50 to-background/80 p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-purple-500/50 hover:shadow-xl">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20 group-hover:scale-105 transition-transform">
            <Ticket className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm tracking-tight leading-tight line-clamp-1">
              {ticket.event_title}
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              {ticket.ticket_code}
            </span>
          </div>
        </div>
        <Badge
          variant="outline"
          className={
            ticket.is_checked_in
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
              : "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30"
          }
        >
          {ticket.is_checked_in ? "Admitted" : "Valid Pass"}
        </Badge>
      </div>

      <div className="space-y-1.5 py-2 text-xs text-muted-foreground border-y border-border/40 my-2.5">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Attendee:</span>
          <span className="font-medium text-foreground">{ticket.attendee_name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Venue:</span>
          <span className="font-medium text-foreground truncate max-w-[200px]">{ticket.hall_name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Seat Allocation:</span>
          <span className="font-bold text-purple-400">{ticket.seat_number}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
          <QrCode className="h-3 w-3 text-purple-500" />
          <span>{ticket.ticket_code}</span>
        </div>
        <Badge variant="secondary" className="text-[10px]">
          {ticket.tier}
        </Badge>
      </div>
    </div>
  );
}
