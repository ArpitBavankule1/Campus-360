"use client";

import React, { useState } from "react";
import { DispensaryMedicine } from "@/types";
import {
  Pill,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
} from "lucide-react";

interface DispensaryStockTableProps {
  medicines: DispensaryMedicine[];
}

export function DispensaryStockTable({ medicines }: DispensaryStockTableProps) {
  const [query, setQuery] = useState("");

  const filtered = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.generic_name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-4 rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Pill className="w-5 h-5 text-primary" />
            Campus Dispensary & Pharmacy Stock
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time inventory of complimentary over-the-counter medicines, ORS, and prescribed therapeutics
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search medicine or generic..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-2xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/50">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 border-b border-border/50 text-muted-foreground uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-4 py-3">Medicine & Strength</th>
              <th className="px-4 py-3">Generic Name</th>
              <th className="px-4 py-3">Available Stock</th>
              <th className="px-4 py-3">Prescription Req.</th>
              <th className="px-4 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3.5 font-bold text-foreground">
                  {item.name}
                </td>
                <td className="px-4 py-3.5 text-muted-foreground">
                  {item.generic_name}
                </td>
                <td className="px-4 py-3.5 font-medium text-foreground">
                  {item.available_quantity} {item.unit}
                </td>
                <td className="px-4 py-3.5">
                  {item.requires_prescription ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                      <FileText className="w-2.5 h-2.5" />
                      Doctor Rx Required
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      OTC Available
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-right">
                  {item.is_in_stock ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      In Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-destructive/15 text-destructive">
                      Depleted
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
