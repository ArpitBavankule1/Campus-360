"use client";

import React from "react";
import { PrintStation } from "@/types";
import { Printer, MapPin, CheckCircle2, AlertTriangle, Layers, Palette } from "lucide-react";

interface PrintStationCardProps {
  station: PrintStation;
  onPrintHere?: (station: PrintStation) => void;
}

export function PrintStationCard({ station, onPrintHere }: PrintStationCardProps) {
  const isOnline = station.status === "Online & Ready";
  const isPaperLow = station.status === "Paper Tray Low";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-6 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl border ${
                isOnline
                  ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                  : isPaperLow
                  ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}
            >
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                    isOnline
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : isPaperLow
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}
                >
                  {isOnline ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  {station.status}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                  {station.queue_jobs_count} in queue
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                {station.kiosk_name}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
          <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>
            {station.campus_building} • {station.floor_location}
          </span>
        </div>

        {/* Consumables Telemetry */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-400">Paper Supply</span>
              <span className="font-bold text-cyan-300">{station.paper_level_pct}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  station.paper_level_pct > 25 ? "bg-cyan-500" : "bg-amber-500"
                }`}
                style={{ width: `${station.paper_level_pct}%` }}
              />
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-400">Toner Cartridge</span>
              <span className="font-bold text-emerald-300">{station.toner_level_pct}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${station.toner_level_pct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-slate-300">
          <span className="px-2 py-0.5 rounded bg-slate-800 flex items-center gap-1">
            <Layers className="w-3 h-3 text-cyan-400" />
            Sizes: {station.supported_sizes.join(", ")}
          </span>
          {station.is_color_capable && (
            <span className="px-2 py-0.5 rounded bg-slate-800 flex items-center gap-1 text-emerald-300">
              <Palette className="w-3 h-3 text-emerald-400" />
              Full Color
            </span>
          )}
          {station.is_duplex_capable && (
            <span className="px-2 py-0.5 rounded bg-slate-800">
              Duplex Double-Sided
            </span>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800 flex items-center justify-end">
        {onPrintHere && (
          <button
            onClick={() => onPrintHere(station)}
            disabled={station.status === "Under Maintenance"}
            className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition-all disabled:opacity-40"
          >
            Spool Job to this Station
          </button>
        )}
      </div>
    </div>
  );
}
