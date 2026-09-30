"use client";

import React, { useState } from "react";
import { EmergencySOSDispatch } from "@/types";
import {
  Siren,
  PhoneCall,
  MapPin,
  CheckCircle2,
  Ambulance,
  AlertCircle,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmergencySOSBeacon() {
  const [triggering, setTriggering] = useState(false);
  const [activeDispatch, setActiveDispatch] = useState<EmergencySOSDispatch | null>(null);
  const [building, setBuilding] = useState("Main Academic Quadrangle, Ground Floor");

  const handleTriggerSOS = async () => {
    setTriggering(true);
    try {
      const res = await fetch("/api/health/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buildingReference: building,
          emergencyType: "general",
          latitude: 18.5204,
          longitude: 73.8567,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActiveDispatch(data.data);
      }
    } catch (err) {
      console.error("SOS trigger error:", err);
    } finally {
      setTriggering(false);
    }
  };

  return (
    <div className="rounded-3xl border border-destructive/30 bg-gradient-to-br from-destructive/10 via-card to-card p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-destructive/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative p-3 rounded-2xl bg-destructive/15 text-destructive">
            <Siren className="w-6 h-6 animate-pulse" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-destructive animate-ping" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              Emergency Health SOS Beacon
            </h3>
            <p className="text-xs text-muted-foreground">
              Immediate medical response, campus ambulance dispatch & paramedical oxygen
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-destructive text-destructive-foreground">
          <Radio className="w-3.5 h-3.5" />
          24/7 Monitored
        </div>
      </div>

      {!activeDispatch ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-background/60 border border-border/60">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span>Current Location Reference:</span>
            </div>
            <select
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-border bg-background text-foreground focus:outline-none"
            >
              <option value="Main Academic Quadrangle, Ground Floor">Main Academic Quadrangle</option>
              <option value="Smart Digital Library, 2nd Floor">Digital Library Commons</option>
              <option value="Aryabhata Hall of Residence (Boys)">Aryabhata Hostel Block</option>
              <option value="Gargi Hall of Residence (Girls)">Gargi Hostel Block</option>
              <option value="Sports Arena & Gymnasium">Sports Complex</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              onClick={handleTriggerSOS}
              disabled={triggering}
              className="w-full sm:w-auto flex-1 rounded-2xl h-12 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-black text-sm tracking-wide gap-2 shadow-lg shadow-destructive/20"
            >
              <Siren className="w-5 h-5" />
              {triggering ? "DISPATCHING EMERGENCY SQUAD..." : "BROADCAST EMERGENCY MEDICAL SOS"}
            </Button>

            <a
              href="tel:108"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 h-12 rounded-2xl border border-border bg-background hover:bg-muted/50 text-xs font-bold text-foreground transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-emerald-500" />
              Direct Ambulance Hotline: 108
            </a>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-destructive/15 border border-destructive/40 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-destructive font-black text-sm">
              <Ambulance className="w-5 h-5 animate-bounce" />
              AMBULANCE DISPATCHED & EN ROUTE
            </div>
            <span className="font-mono text-xs font-bold text-destructive">
              Ticket: {activeDispatch.sos_ticket_code}
            </span>
          </div>

          <p className="text-xs text-foreground font-medium">
            Campus Ambulance #1 and Paramedics dispatched to{" "}
            <span className="font-bold underline">{activeDispatch.building_reference}</span>. Estimated response time: 3-5 minutes.
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-destructive/20 text-xs">
            <span className="text-muted-foreground">Duty Medical Officer: Dr. Arvind Chawla</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActiveDispatch(null)}
              className="rounded-xl text-xs h-7 border-destructive/40 text-destructive"
            >
              Dismiss / Attended
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
