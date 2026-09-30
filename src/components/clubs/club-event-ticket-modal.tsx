"use client";

import React, { useState } from "react";
import { ClubEventTicket } from "@/types";
import {
  X,
  Ticket,
  Printer,
  Copy,
  Check,
  MapPin,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";

interface ClubEventTicketModalProps {
  ticket: ClubEventTicket;
  onClose: () => void;
}

export function ClubEventTicketModal({
  ticket,
  onClose,
}: ClubEventTicketModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ticket.ticket_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-border/80 bg-card p-6 shadow-2xl space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-1">
            <Ticket className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground">
            Official Campus Event Entry Pass
          </h3>
          <p className="text-xs text-muted-foreground">
            {ticket.event_title}
          </p>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-5 rounded-3xl bg-white border border-border/60 shadow-inner">
          <QRCodeSVG
            value={ticket.ticket_code}
            size={180}
            level="H"
            includeMargin
            className="rounded-xl"
          />
          <span className="text-[11px] font-mono text-zinc-700 mt-2 font-bold">
            {ticket.ticket_code}
          </span>
        </div>

        {/* Ticket Details */}
        <div className="space-y-2 p-3.5 rounded-2xl bg-muted/40 border border-border/40 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Access Tier:</span>
            <span className="font-semibold text-foreground">{ticket.seat_tier}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Venue:</span>
            <span className="font-semibold text-foreground flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {ticket.venue}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Verification:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Institutional Registration
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="outline"
            onClick={handleCopy}
            className="flex-1 rounded-2xl text-xs gap-1.5 h-10"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Code
              </>
            )}
          </Button>

          <Button
            onClick={handlePrint}
            className="flex-1 rounded-2xl text-xs gap-1.5 h-10"
          >
            <Printer className="w-4 h-4" />
            Print Entry Pass
          </Button>
        </div>
      </div>
    </div>
  );
}
