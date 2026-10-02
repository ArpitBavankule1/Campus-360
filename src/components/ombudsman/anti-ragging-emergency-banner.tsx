"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  PhoneCall,
  Siren,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function AntiRaggingEmergencyBanner() {
  const [dispatched, setDispatched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("Hostel Complex Outer Quad");

  const handlePanicAlert = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ombudsman/anti-ragging", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campus_location: location,
          incident_summary: "Emergency student panic alert triggered from portal.",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDispatched(true);
      }
    } catch (e) {
      console.error("Anti-ragging dispatch failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-destructive/30 bg-gradient-to-r from-destructive/15 via-destructive/5 to-card p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-destructive text-white shadow-md shrink-0 animate-pulse">
            <Siren className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-destructive bg-destructive/10 px-2.5 py-0.5 rounded-full border border-destructive/20">
              <ShieldAlert className="w-3 h-3" />
              Statutory 24/7 Anti-Ragging & ICC Zero-Tolerance Cell
            </div>
            <h2 className="text-lg font-extrabold text-foreground">
              Immediate Anti-Ragging Emergency Rapid Response
            </h2>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              Ragging in any form is a non-bailable cognizable criminal offense under UGC/AICTE regulations. Reports trigger instant Proctorial Squad dispatch and independent ombudsman tribunal hearing within 24 hours.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          <a
            href="tel:18001805522"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-muted border border-border/80 text-foreground font-semibold text-xs hover:bg-muted/80 transition-colors"
          >
            <PhoneCall className="w-4 h-4 text-emerald-500" />
            <span>Toll-Free: 1800-180-5522</span>
          </a>

          {dispatched ? (
            <div className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Squad Dispatched (ETA 3 Min)</span>
            </div>
          ) : (
            <Button
              onClick={handlePanicAlert}
              disabled={loading}
              className="w-full sm:w-auto rounded-2xl gap-2 text-xs h-10 px-4 bg-destructive hover:bg-destructive/90 text-white font-bold shadow-md"
            >
              <Siren className="w-4 h-4" />
              {loading ? "Mobilizing Squad..." : "Trigger Rapid Squad Dispatch"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
