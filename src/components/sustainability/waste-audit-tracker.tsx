"use client";

import React from "react";
import { WasteAudit } from "@/types";
import {
  Trash2,
  Apple,
  Recycle,
  Cpu,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

interface WasteAuditTrackerProps {
  audits: WasteAudit[];
}

export function WasteAuditTracker({ audits }: WasteAuditTrackerProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {audits.map((audit) => (
          <div
            key={audit.id}
            className="rounded-3xl border border-border/70 bg-card p-5 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-base text-foreground leading-snug">
                    {audit.audit_week}
                  </h3>
                  <div className="text-xs text-muted-foreground">
                    Auditor: {audit.auditor_officer}
                  </div>
                </div>

                <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-center font-mono">
                  <div className="text-base font-extrabold leading-none">
                    {audit.landfill_diversion_rate_percent}%
                  </div>
                  <div className="text-[9px] uppercase font-bold tracking-tight mt-0.5">
                    Diversion
                  </div>
                </div>
              </div>

              {/* Categorized Breakdown */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-2xl bg-muted/40 border border-border/40 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600">
                    <Apple className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground">Organic Compost</div>
                    <div className="font-bold font-mono text-foreground">
                      {audit.organic_compost_kg} kg
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-muted/40 border border-border/40 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600">
                    <Recycle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground">Dry Recyclables</div>
                    <div className="font-bold font-mono text-foreground">
                      {audit.dry_recyclables_kg} kg
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-muted/40 border border-border/40 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground">E-Waste Salvaged</div>
                    <div className="font-bold font-mono text-foreground">
                      {audit.electronic_waste_kg} kg
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-muted/40 border border-border/40 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground">Landfill Residue</div>
                    <div className="font-bold font-mono text-foreground">
                      {audit.landfill_waste_kg} kg
                    </div>
                  </div>
                </div>
              </div>

              {audit.remarks && (
                <p className="text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-xl border border-border/30 italic">
                  "{audit.remarks}"
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> ISO 14001 Compliant Audit
              </span>
              <span className="flex items-center gap-1 text-[11px]">
                <TrendingUp className="w-3.5 h-3.5 text-primary" /> Zero-Waste Campus Goal
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
