"use client";

import React, { useState } from "react";
import { TransportPass } from "@/types";
import {
  X,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  Bus,
  Zap,
  Calendar,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";

interface TransportPassModalProps {
  pass: TransportPass;
  onClose: () => void;
}

export function TransportPassModal({ pass, onClose }: TransportPassModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pass.pass_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl border border-border/80 bg-card p-6 shadow-2xl space-y-5">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Card Header */}
        <div className="text-center space-y-1 pt-1">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-1">
            <Bus className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground">
            Smart Campus Boarding Pass
          </h3>
          <p className="text-xs text-muted-foreground">
            Valid across All Campus EV Shuttles & Loop Buses
          </p>
        </div>

        {/* Ticket Body */}
        <div className="relative rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-card via-background to-emerald-500/5 p-4 shadow-inner space-y-4 overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                Scholar Passholder
              </p>
              <p className="text-sm font-bold text-foreground">
                {pass.scholar_name}
              </p>
              <p className="text-[11px] text-emerald-600 font-medium capitalize">
                {pass.pass_type.replace("_", " ")}
              </p>
            </div>
            <div className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> ACTIVE
            </div>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white shadow-sm border border-neutral-200 mx-auto w-fit">
            <QRCodeSVG
              value={`https://campuslens.ai/verify-transport?code=${pass.pass_code}`}
              size={130}
              level="H"
              includeMargin={false}
            />
          </div>

          <div className="text-center space-y-0.5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Pass Voucher Code
            </p>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-foreground bg-muted/60 px-3 py-1 rounded-lg border border-border">
              <span>{pass.pass_code}</span>
              <button
                onClick={handleCopyCode}
                className="hover:text-primary transition-colors"
                title="Copy voucher code"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Validity footer */}
          <div className="pt-2 border-t border-border/40 grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
            <div>
              <span className="font-semibold text-foreground">Valid From:</span> {pass.valid_from}
            </div>
            <div className="text-right">
              <span className="font-semibold text-foreground">Expires:</span> {pass.valid_to}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="flex-1 rounded-xl text-xs gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Ticket
          </Button>
          <Button
            size="sm"
            onClick={onClose}
            className="flex-1 rounded-xl text-xs"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
